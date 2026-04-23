import { doc, getDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'

// ─── Validation ───────────────────────────────────────────────────────────────

export function validateQRData(data) {
  if (!data) return false
  if (data.Consumed !== true) return false
  if (!data.UserID?.trim()) return false
  if (!data.productId?.trim()) return false
  if (data.productMapped !== true) return false
  return true
}

// UserID is stored as "uid childSuffix" e.g. "abc123 1"
export function parseUserID(userID) {
  if (!userID) return { uid: null, childId: null }
  const parts = userID.trim().split(' ')
  const uid = parts[0] || null
  const suffix = parts[1] ?? ''
  const childId = suffix !== '' ? 'child' + suffix : 'child'
  return { uid, childId }
}

// ─── Data fetching ────────────────────────────────────────────────────────────

export async function fetchAndValidateQR(passcode) {
  if (!passcode?.trim()) {
    return { valid: false, qrData: null }
  }

  const ref = doc(db, 'lnfQR', passcode.trim())
  const snap = await getDoc(ref)

  if (!snap.exists()) {
    return { valid: false, qrData: null }
  }

  const qrData = { id: snap.id, ...snap.data() }

  if (!validateQRData(qrData)) {
    return { valid: false, qrData }
  }

  return { valid: true, qrData }
}

export async function fetchItemData(productId) {
  if (!productId) return null
  try {
    const ref = doc(db, 'Items', productId)
    const snap = await getDoc(ref)
    if (!snap.exists()) return null
    return { id: snap.id, ...snap.data() }
  } catch {
    return null
  }
}

export async function fetchOwnerContact(uid, childId) {
  if (!uid || !childId) return {}
  try {
    const ref = doc(db, 'Users', uid, 'ChildList', childId, 'data', 'personal_information')
    const snap = await getDoc(ref)
    if (!snap.exists()) return {}
    const d = snap.data()
    return {
      name: d.name || d['Full Name'] || d['fullName'] || '',
      phone: d.phone || d['Phone'] || d['Phone Number'] || d['Mobile'] || '',
      photoURL: d.photoURL || d['Photo URL'] || d['profilePhoto'] || '',
      email: d.email || d['Email'] || '',
    }
  } catch {
    return {}
  }
}
