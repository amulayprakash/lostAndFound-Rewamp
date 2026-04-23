import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  fetchAndValidateQR,
  fetchItemData,
  fetchOwnerContact,
  parseUserID,
} from '../../services/qrLandingService'
import LostFoundLanding from './LostFoundLanding'
import CarsLanding from './CarsLanding'

const FALLBACK_BASE = 'https://web.wesafeqr.com/?lnfqr='

// ─── Shimmer skeleton block ────────────────────────────────────────────────────

function Shimmer({ className = '' }) {
  return (
    <div className={`relative overflow-hidden bg-muted rounded-2xl ${className}`}>
      <div
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
        style={{ animation: 'shimmer 1.6s infinite' }}
      />
    </div>
  )
}

// ─── Loading skeleton — mirrors header + hero + cards layout ──────────────────

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header skeleton */}
      <div
        className="sticky top-0 z-50 flex items-center justify-between h-14 px-4"
        style={{
          background: 'hsl(var(--background) / 0.88)',
          borderBottom: '1px solid hsl(var(--border) / 0.7)',
          boxShadow: '0 1px 0 hsl(var(--border) / 0.5)',
        }}
      >
        <div className="flex items-center gap-2.5">
          <Shimmer className="w-8 h-8 rounded-lg" />
          <Shimmer className="w-24 h-4" />
        </div>
        <Shimmer className="w-24 h-7 rounded-full" />
      </div>

      {/* Hero skeleton */}
      <div className="px-4 pt-7 pb-8 max-w-lg mx-auto">
        <div className="flex items-center gap-4">
          <Shimmer className="w-[72px] h-[72px] rounded-[22px] flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Shimmer className="w-28 h-5 rounded-full" />
            <Shimmer className="w-48 h-6" />
            <Shimmer className="w-20 h-4" />
          </div>
        </div>
      </div>

      {/* Card skeletons */}
      <div className="px-4 space-y-3.5 max-w-lg mx-auto">
        <Shimmer className="w-full h-24" />
        <Shimmer className="w-full h-32" />
        <Shimmer className="w-full h-[68px]" />
        <Shimmer className="w-full h-14" />
        <div className="grid grid-cols-2 gap-3 pt-1">
          <Shimmer className="h-[80px]" />
          <Shimmer className="h-[80px]" />
        </div>
      </div>
    </div>
  )
}

// ─── Error screen ──────────────────────────────────────────────────────────────

function ErrorScreen({ message }) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header
        className="sticky top-0 z-50 flex items-center h-14 px-4 gap-2.5"
        style={{
          background: 'hsl(var(--background) / 0.88)',
          backdropFilter: 'blur(24px) saturate(200%)',
          WebkitBackdropFilter: 'blur(24px) saturate(200%)',
          borderBottom: '1px solid hsl(var(--border) / 0.7)',
          boxShadow: '0 1px 0 hsl(var(--border) / 0.5), 0 2px 12px hsl(var(--foreground) / 0.04)',
        }}
      >
        <img
          src="/logo1.png"
          alt="WeSafe QR"
          className="w-8 h-8 rounded-lg object-cover"
          style={{ boxShadow: '0 2px 8px hsl(var(--primary) / 0.25)' }}
        />
        <span className="font-bold text-[17px] tracking-tight">WeSafe QR</span>
      </header>

      {/* Error body */}
      <div className="flex flex-col items-center justify-center min-h-[calc(100dvh-56px)] px-6 text-center gap-5">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
          className="w-20 h-20 rounded-[24px] flex items-center justify-center"
          style={{ background: 'hsl(350 82% 60% / 0.10)' }}
        >
          <span className="material-symbols-outlined filled text-5xl" style={{ color: 'hsl(350 82% 60%)' }}>
            error
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
        >
          <h2 className="text-[20px] font-bold tracking-tight mb-2">Something Went Wrong</h2>
          <p className="text-[14px] text-muted-foreground max-w-xs leading-relaxed">{message}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.22 }}
          className="flex items-center gap-2 pt-2"
        >
          <img src="/logo1.png" alt="" className="w-4 h-4 rounded-[5px] opacity-40" />
          <p className="text-[11px] text-muted-foreground">WeSafe QR · Smart tags. Instant returns.</p>
        </motion.div>
      </div>
    </div>
  )
}

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function QRLandingPage() {
  const { passcode } = useParams()
  const [state, setState] = useState('loading')
  const [qrData, setQrData] = useState(null)
  const [itemData, setItemData] = useState(null)
  const [ownerContact, setOwnerContact] = useState({})
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    if (!passcode) {
      window.location.replace(FALLBACK_BASE)
      return
    }

    let cancelled = false

    async function load() {
      try {
        const { valid, qrData: qr } = await fetchAndValidateQR(passcode)

        if (!valid) {
          window.location.replace(FALLBACK_BASE + encodeURIComponent(passcode))
          return
        }

        const { uid, childId } = parseUserID(qr.UserID)

        const [item, contact] = await Promise.all([
          fetchItemData(qr.productId),
          fetchOwnerContact(uid, childId),
        ])

        if (cancelled) return

        setQrData(qr)
        setItemData(item ?? null)
        setOwnerContact(contact)
        setState('valid')
      } catch (err) {
        if (!cancelled) {
          setErrorMsg(err.message || 'Could not load QR details.')
          setState('error')
        }
      }
    }

    load()
    return () => { cancelled = true }
  }, [passcode])

  if (state === 'loading') return <LoadingSkeleton />
  if (state === 'error') return <ErrorScreen message={errorMsg} />

  const qrType = qrData?.qrType ?? 'lostAndFound'

  if (qrType === 'cars') {
    return (
      <CarsLanding
        passcode={passcode}
        qrData={qrData}
        itemData={itemData}
        ownerContact={ownerContact}
      />
    )
  }

  return (
    <LostFoundLanding
      passcode={passcode}
      qrData={qrData}
      itemData={itemData}
      ownerContact={ownerContact}
    />
  )
}
