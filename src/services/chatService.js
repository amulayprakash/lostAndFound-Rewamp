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

// ─── Session token (per passcode, per browser session) ────────────────────────

const SESSION_KEY_PREFIX = 'wesafe_lnf_chat_'

function getSessionToken(passcode) {
  return sessionStorage.getItem(SESSION_KEY_PREFIX + passcode)
}

function setSessionToken(passcode, token) {
  sessionStorage.setItem(SESSION_KEY_PREFIX + passcode, token)
}

// ─── Room management ──────────────────────────────────────────────────────────

export async function getRoomMeta(passcode) {
  const ref = doc(db, 'chats', passcode)
  const snap = await getDoc(ref)
  if (!snap.exists()) return null
  return snap.data()
}

/**
 * Opens or creates the 1:1 chat room for a QR passcode.
 * Returns { status: 'created'|'resumed'|'claimed', responderToken }
 *
 * 'claimed'  = another responder already owns this room and our token doesn't match.
 * 'created'  = we created the room (first responder).
 * 'resumed'  = we previously created it and the stored token still matches.
 */
export async function getOrCreateRoom(passcode, ownerUid, seedMessage) {
  const existingToken = getSessionToken(passcode)
  const roomRef = doc(db, 'chats', passcode)
  const snap = await getDoc(roomRef)

  if (snap.exists()) {
    const data = snap.data()
    if (existingToken && data.responderToken === existingToken) {
      return { status: 'resumed', responderToken: existingToken }
    }
    return { status: 'claimed', responderToken: null }
  }

  // Create the room
  const responderToken = crypto.randomUUID()
  await setDoc(roomRef, {
    passcode,
    ownerUid,
    responderToken,
    createdAt: serverTimestamp(),
  })

  // Seed with the owner's message
  if (seedMessage?.trim()) {
    await addDoc(collection(db, 'chats', passcode, 'messages'), {
      text: seedMessage.trim(),
      senderType: 'owner',
      createdAt: serverTimestamp(),
    })
  }

  setSessionToken(passcode, responderToken)
  return { status: 'created', responderToken }
}

// ─── Messaging ────────────────────────────────────────────────────────────────

export async function sendMessage(passcode, text, senderType = 'responder') {
  if (!text?.trim()) return
  await addDoc(collection(db, 'chats', passcode, 'messages'), {
    text: text.trim(),
    senderType,
    createdAt: serverTimestamp(),
  })
}

/**
 * Subscribes to messages for a room in real-time.
 * Returns an unsubscribe function.
 */
export function subscribeMessages(passcode, callback) {
  const q = query(
    collection(db, 'chats', passcode, 'messages'),
    orderBy('createdAt', 'asc')
  )
  return onSnapshot(q, (snap) => {
    const messages = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
    callback(messages)
  })
}
