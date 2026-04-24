import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const CYAN = '#06B6D4'
const CYAN_BG = 'hsl(197 84% 44% / 0.10)'
const CYAN_BORDER = 'hsl(197 84% 44% / 0.25)'
const GREEN = '#10B981'

const VEHICLE_ICON = {
  Car: 'directions_car',
  Motorbike: 'two_wheeler',
  Other: 'commute',
}

function vehicleIcon(vehicleType) {
  return VEHICLE_ICON[vehicleType] || 'commute'
}

function Avatar({ name, photoURL, size = 40 }) {
  const initials = (name || '?').slice(0, 2).toUpperCase()
  if (photoURL) {
    return (
      <img
        src={photoURL}
        alt={name}
        className="rounded-full object-cover flex-shrink-0"
        style={{ width: size, height: size }}
      />
    )
  }
  return (
    <div
      className="rounded-full flex items-center justify-center flex-shrink-0 font-bold"
      style={{
        width: size,
        height: size,
        background: CYAN_BG,
        color: CYAN,
        border: `1.5px solid ${CYAN_BORDER}`,
        fontSize: size < 40 ? 11 : 14,
      }}
    >
      {initials}
    </div>
  )
}

function NumberPlate({ number }) {
  if (!number) return null
  return (
    <div
      className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border-2 font-mono font-black tracking-[0.18em] text-2xl"
      style={{
        borderColor: CYAN_BORDER,
        background: 'hsl(197 84% 44% / 0.06)',
        color: 'hsl(var(--foreground))',
        boxShadow: `0 2px 12px ${CYAN_BG}, inset 0 1px 0 rgba(255,255,255,0.4)`,
      }}
    >
      <span className="material-symbols-outlined text-[15px] opacity-50" style={{ color: CYAN }}>article</span>
      {number.toUpperCase()}
    </div>
  )
}

export default function CarsLanding({ passcode, qrData, itemData, ownerContact }) {
  const navigate = useNavigate()

  const vehicleType = itemData?.vehicleType || qrData?.vehicleType || 'Car'
  const vehicleNumber = itemData?.vehicleNumber || qrData?.vehicleNumber || ''
  const vehicleLabel = itemData?.ownerName || qrData?.name || vehicleType
  const wordFromOwner = itemData?.wordFromOwner || qrData?.wordFromOwner || ''
  const ownerName = ownerContact?.name || itemData?.ownerName || qrData?.ownerName || 'Owner'
  const phone = ownerContact?.phone || ''

  const handleCall = () => {
    if (phone) window.location.href = `tel:${phone}`
  }

  const handleMessage = () => {
    navigate(`/qr/${passcode}/chat`, {
      state: {
        itemName: vehicleLabel,
        ownerName,
        wordFromOwner,
        ownerPhone: phone,
        qrType: 'cars',
        ownerUid: null,
      },
    })
  }

  return (
    <div className="min-h-screen bg-background">

      {/* ── Sticky Glass Header — matches WeSafe rewamp TopNav style ── */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between h-14 px-4"
        style={{
          background: 'hsl(var(--background) / 0.88)',
          backdropFilter: 'blur(24px) saturate(200%)',
          WebkitBackdropFilter: 'blur(24px) saturate(200%)',
          borderBottom: '1px solid hsl(var(--border) / 0.7)',
          boxShadow: '0 1px 0 hsl(var(--border) / 0.5), 0 2px 12px hsl(var(--foreground) / 0.04)',
        }}
      >
        <div className="flex items-center gap-2.5">
          <img
            src="/logo1.png"
            alt="WeSafe QR"
            className="w-8 h-8 rounded-lg object-cover"
            style={{ boxShadow: '0 2px 8px hsl(var(--primary) / 0.25)' }}
          />
          <span className="font-bold text-[17px] tracking-tight">WeSafe QR</span>
        </div>
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold"
          style={{ background: CYAN_BG, color: CYAN, border: `1px solid ${CYAN_BORDER}` }}
        >
          <span className="material-symbols-outlined filled" style={{ fontSize: 12 }}>commute</span>
          Vehicle QR
        </div>
      </header>

      {/* ── Hero Section ── */}
      <div
        className="relative overflow-hidden px-4 pt-7 pb-8"
        style={{ background: 'linear-gradient(180deg, hsl(197 84% 44% / 0.07) 0%, transparent 100%)' }}
      >
        <motion.div
          className="absolute -top-14 -right-14 w-52 h-52 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, hsl(197 84% 44% / 0.18) 0%, transparent 65%)' }}
          animate={{ scale: [1, 1.18, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="relative z-10 max-w-lg mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
            className="flex items-center gap-4"
          >
            <motion.div
              initial={{ scale: 0.65, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.08, type: 'spring', stiffness: 260, damping: 18 }}
              className="w-[72px] h-[72px] rounded-[22px] flex items-center justify-center flex-shrink-0"
              style={{
                background: `linear-gradient(135deg, hsl(197 84% 36%) 0%, ${CYAN} 100%)`,
                boxShadow: `0 8px 28px hsl(197 84% 44% / 0.38), inset 0 1px 0 rgba(255,255,255,0.22)`,
              }}
            >
              <span className="material-symbols-outlined filled text-white" style={{ fontSize: 34 }}>
                {vehicleIcon(vehicleType)}
              </span>
            </motion.div>

            <div className="flex-1 min-w-0">
              <div
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2"
                style={{ background: CYAN_BG, color: CYAN, border: `1px solid ${CYAN_BORDER}` }}
              >
                <span className="material-symbols-outlined filled" style={{ fontSize: 11 }}>commute</span>
                {vehicleType} QR
              </div>
              <h1 className="text-[22px] font-bold tracking-tight text-foreground leading-tight truncate">
                {vehicleLabel}
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">{vehicleType}</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="px-4 pb-10 space-y-3.5 max-w-lg mx-auto">

        {/* Number plate */}
        {vehicleNumber && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14, duration: 0.38 }}
            className="bg-card rounded-2xl border border-border/60 overflow-hidden"
            style={{ boxShadow: '0 1px 2px hsl(var(--foreground) / 0.04), 0 2px 8px hsl(var(--primary) / 0.06)' }}
          >
            <div
              className="flex items-center gap-2 px-4 py-2.5 border-b border-border/50"
              style={{ background: 'hsl(var(--muted) / 0.5)' }}
            >
              <span className="material-symbols-outlined text-[16px]" style={{ color: CYAN }}>article</span>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Registration Number</span>
            </div>
            <div className="px-4 py-5 flex justify-center">
              <NumberPlate number={vehicleNumber} />
            </div>
          </motion.div>
        )}

        {/* Owner message */}
        {wordFromOwner && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.20, duration: 0.38 }}
            className="rounded-2xl overflow-hidden"
            style={{
              background: CYAN_BG,
              border: `1.5px solid ${CYAN_BORDER}`,
              boxShadow: `0 4px 20px hsl(197 84% 44% / 0.12)`,
            }}
          >
            <div
              className="flex items-center gap-2 px-4 py-2.5 border-b"
              style={{ borderColor: CYAN_BORDER }}
            >
              <span className="material-symbols-outlined filled text-[16px]" style={{ color: CYAN }}>format_quote</span>
              <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: CYAN }}>Word from the Owner</span>
            </div>
            <p className="px-4 py-4 text-[15px] font-medium text-foreground leading-relaxed">"{wordFromOwner}"</p>
          </motion.div>
        )}

        {/* Owner info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.26, duration: 0.38 }}
          className="bg-card rounded-2xl border border-border/60 px-4 py-3.5 flex items-center gap-3"
          style={{ boxShadow: '0 1px 2px hsl(var(--foreground) / 0.04), 0 2px 8px hsl(var(--primary) / 0.06)' }}
        >
          <Avatar name={ownerName} photoURL={ownerContact?.photoURL} size={46} />
          <div className="flex-1 min-w-0">
            <p className="text-[11px] text-muted-foreground font-medium">Vehicle Owner</p>
            <p className="text-[15px] font-bold text-foreground truncate">{ownerName}</p>
          </div>
          <div
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[10px] font-bold flex-shrink-0"
            style={{ background: 'hsl(160 76% 38% / 0.10)', color: GREEN, border: '1px solid hsl(160 76% 38% / 0.22)' }}
          >
            <span className="material-symbols-outlined filled" style={{ fontSize: 11 }}>verified</span>
            Verified
          </div>
        </motion.div>

        {/* Notice strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.32 }}
          className="flex items-start gap-2.5 px-4 py-3 rounded-xl"
          style={{ background: 'hsl(38 88% 50% / 0.07)', border: '1px solid hsl(38 88% 50% / 0.18)' }}
        >
          <span className="material-symbols-outlined filled text-[17px] flex-shrink-0 mt-0.5" style={{ color: '#F59E0B' }}>
            info
          </span>
          <p className="text-[13px] text-muted-foreground leading-relaxed">
            This vehicle is protected by WeSafe QR. The owner has been notified. Use the buttons below to contact them directly.
          </p>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.36, duration: 0.4 }}
          className="grid grid-cols-2 gap-3 pt-1"
        >
          <button
            onClick={handleCall}
            disabled={!phone}
            className="flex flex-col items-center justify-center gap-2 h-[80px] rounded-2xl font-bold text-[13px] transition-all active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: phone
                ? 'linear-gradient(135deg, hsl(160 76% 32%) 0%, hsl(160 76% 44%) 100%)'
                : 'hsl(var(--muted))',
              color: phone ? '#fff' : 'hsl(var(--muted-foreground))',
              boxShadow: phone
                ? '0 6px 20px hsl(160 76% 38% / 0.38), inset 0 1px 0 rgba(255,255,255,0.18)'
                : 'none',
            }}
          >
            <span className="material-symbols-outlined filled" style={{ fontSize: 26 }}>call</span>
            <span>{phone ? 'Call Owner' : 'Call Unavailable'}</span>
          </button>

          <button
            onClick={handleMessage}
            className="flex flex-col items-center justify-center gap-2 h-[80px] rounded-2xl font-bold text-[13px] text-white transition-all active:scale-[0.97]"
            style={{
              background: `linear-gradient(135deg, hsl(197 84% 36%) 0%, ${CYAN} 100%)`,
              boxShadow: `0 6px 20px hsl(197 84% 44% / 0.38), inset 0 1px 0 rgba(255,255,255,0.18)`,
            }}
          >
            <span className="material-symbols-outlined filled" style={{ fontSize: 26 }}>chat</span>
            <span>Message Owner</span>
          </button>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-2 pt-3 pb-2"
        >
          <img src="/logo1.png" alt="" className="w-4 h-4 rounded-[5px] opacity-50" />
          <p className="text-[11px] text-muted-foreground">
            Secured by <span className="font-semibold" style={{ color: CYAN }}>WeSafe QR</span>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
