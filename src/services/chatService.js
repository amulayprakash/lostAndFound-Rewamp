import {
  doc,
  getDoc,
  setDoc,
  addDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../lib/firebase'

// ─── Session storage (per passcode, per browser tab) ──────────────────────────
// Stores { roomId, token } so returning finders resume their own room.

const SESSION_KEY_PREFIX = 'wesafe_lnf_chat_'

function getSession(passcode) {
  try {
    const val = sessionStorage.getItem(SESSION_KEY_PREFIX + passcode)
    return val ? JSON.parse(val) : null
  } catch {
    return null
  }
}

function setSession(passcode, roomId, token) {
  sessionStorage.setItem(SESSION_KEY_PREFIX + passcode, JSON.stringify({ roomId, token }))
}

// ─── Room management ──────────────────────────────────────────────────────────

/**
 * Opens or creates a personal 1:1 chat room for this finder.
 * Every finder gets their own room — no "claimed" state.
 * Returns { status: 'created'|'resumed', roomId, responderToken, ownerAccessToken }
 */
export async function getOrCreateRoom(passcode, ownerUid, seedMessage) {
  // Check if this browser tab already has a room for this passcode
  const session = getSession(passcode)

  if (session?.roomId && session?.token) {
    const roomRef = doc(db, 'chats', session.roomId)
    const snap = await getDoc(roomRef)
    if (snap.exists() && snap.data().responderToken === session.token) {
      return {
        status: 'resumed',
        roomId: session.roomId,
        responderToken: session.token,
        ownerAccessToken: snap.data().ownerAccessToken ?? null,
      }
    }
    // Stale session — fall through and create a new room
  }

  // Create a brand-new room for this finder
  const roomId = crypto.randomUUID()
  const responderToken = crypto.randomUUID()
  const ownerAccessToken = crypto.randomUUID()

  const roomRef = doc(db, 'chats', roomId)
  await setDoc(roomRef, {
    roomId,
    passcode,
    ownerUid,
    responderToken,
    ownerAccessToken,
    createdAt: serverTimestamp(),
  })

  // Seed with the owner's "word from owner" message
  if (seedMessage?.trim()) {
    await addDoc(collection(db, 'chats', roomId, 'messages'), {
      text: seedMessage.trim(),
      senderType: 'owner',
      createdAt: serverTimestamp(),
    })
  }

  setSession(passcode, roomId, responderToken)
  return { status: 'created', roomId, responderToken, ownerAccessToken }
}

/**
 * Verifies an owner access token for a specific roomId.
 */
export async function verifyOwnerToken(roomId, token) {
  if (!roomId || !token) return false
  try {
    const snap = await getDoc(doc(db, 'chats', roomId))
    if (!snap.exists()) return false
    return snap.data().ownerAccessToken === token
  } catch {
    return false
  }
}

// ─── WhatsApp Notification ────────────────────────────────────────────────────

/**
 * Sends a professional WhatsApp message to the item owner with the unique chat link.
 * Fire-and-forget — errors are swallowed to not block the chat flow.
 */
export function sendOwnerWhatsAppNotification(phone, chatUrl, itemName, ownerName) {
  if (!phone) {
    console.warn('[WeSafe] WhatsApp skipped — no phone number available')
    return
  }

  // Normalise: strip leading +, spaces, dashes then strip country code 91 if present
  const cleaned = phone.replace(/[\s\-\+]/g, '')
  const normalised = cleaned.startsWith('91') && cleaned.length > 10
    ? cleaned.slice(2)
    : cleaned

  const name = ownerName || 'there'
  const item = itemName || 'your item'
  const message =
    `Hello ${name}! Someone has found your item *"${item}"* and wants to return it to you.\n\n` +
    `Click the link below to chat directly with the finder and arrange the return:\n${chatUrl}\n\n` +
    `_This is a secure private chat powered by WeSafe QR._`

  const token = import.meta.env.VITE_WHATSAPP_USER_ID
  const url =
    `https://wts.vision360solutions.co.in/api/sendText` +
    `?token=${token}&phone=91${normalised}&message=${encodeURIComponent(message)}`

  console.log('[WeSafe] Sending WhatsApp to 91' + normalised)

  fetch(url)
    .then(r => console.log('[WeSafe] WhatsApp response status:', r.status))
    .catch(err => console.error('[WeSafe] WhatsApp fetch error:', err))
}

// ─── Messaging ────────────────────────────────────────────────────────────────

export async function sendMessage(roomId, text, senderType = 'responder') {
  if (!text?.trim()) return
  await addDoc(collection(db, 'chats', roomId, 'messages'), {
    text: text.trim(),
    senderType,
    createdAt: serverTimestamp(),
  })
}

export function subscribeMessages(roomId, callback) {
  const q = query(
    collection(db, 'chats', roomId, 'messages'),
    orderBy('createdAt', 'asc')
  )
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  })
}
