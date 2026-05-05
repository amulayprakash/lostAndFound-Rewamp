import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const AMBER = '#F59E0B'
const AMBER_BG = 'hsl(38 88% 50% / 0.10)'
const AMBER_BORDER = 'hsl(38 88% 50% / 0.25)'
const GREEN = '#10B981'

const ITEM_ICON = {
  Handbag: 'shopping_bag',
  Luggage: 'luggage',
  Bag: 'backpack',
  Other: 'inventory_2',
}

function itemIcon(itemType) {
  return ITEM_ICON[itemType] || 'inventory_2'
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
        background: AMBER_BG,
        color: AMBER,
        border: `1.5px solid ${AMBER_BORDER}`,
        fontSize: size < 40 ? 11 : 14,
      }}
    >
      {initials}
    </div>
  )
}

export default function LostFoundLanding({ passcode, qrData, itemData, ownerContact }) {
  const navigate = useNavigate()

  const itemType = itemData?.itemType || qrData?.itemType || 'Other'
  const itemName = itemData?.ownerName || itemData?.itemTypeName || qrData?.name || itemType
  const description = itemData?.description || qrData?.description || ''
  const wordFromOwner = itemData?.wordFromOwner || qrData?.wordFromOwner || ''
  const ownerName = ownerContact?.name || itemData?.ownerName || qrData?.ownerName || 'Owner'
  const phone =
    ownerContact?.phone ||
    itemData?.phone || itemData?.['Phone'] || itemData?.['Phone Number'] || itemData?.['Mobile'] ||
    qrData?.phone || qrData?.['Phone'] || ''

  const handleCall = () => {
    if (phone) window.location.href = `tel:${phone}`
  }

  const handleMessage = () => {
    navigate(`/qr/${passcode}/chat`, {
      state: {
        itemName,
        ownerName,
        wordFromOwner,
        ownerPhone: phone,
        qrType: 'lostAndFound',
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
          style={{ background: AMBER_BG, color: AMBER, border: `1px solid ${AMBER_BORDER}` }}
        >
          <span className="material-symbols-outlined filled" style={{ fontSize: 12 }}>sell</span>
          Lost &amp; Found
        </div>
      </header>

      {/* ── Hero Section ── */}
      <div
        className="relative overflow-hidden px-4 pt-7 pb-8"
        style={{ background: 'linear-gradient(180deg, hsl(38 88% 50% / 0.07) 0%, transparent 100%)' }}
      >
        <motion.div
          className="absolute -top-14 -right-14 w-52 h-52 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, hsl(38 88% 50% / 0.16) 0%, transparent 65%)' }}
          animate={{ scale: [1, 1.18, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
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
                background: `linear-gradient(135deg, hsl(38 88% 40%) 0%, ${AMBER} 100%)`,
                boxShadow: `0 8px 28px hsl(38 88% 50% / 0.38), inset 0 1px 0 rgba(255,255,255,0.22)`,
              }}
            >
              <span className="material-symbols-outlined filled text-white" style={{ fontSize: 34 }}>
                {itemIcon(itemType)}
              </span>
            </motion.div>

            <div className="flex-1 min-w-0">
              <div
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2"
                style={{ background: AMBER_BG, color: AMBER, border: `1px solid ${AMBER_BORDER}` }}
              >
                <span className="material-symbols-outlined filled" style={{ fontSize: 11 }}>sell</span>
                Lost &amp; Found Item
              </div>
              <h1 className="text-[22px] font-bold tracking-tight text-foreground leading-tight truncate">
                {itemName}
              </h1>
              {itemType !== 'Other' && (
                <p className="text-sm text-muted-foreground mt-0.5">{itemType}</p>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="px-4 pb-10 space-y-3.5 max-w-lg mx-auto">

        {/* Description */}
        {description && (
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
              <span className="material-symbols-outlined text-[16px] text-muted-foreground">description</span>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Item Details</span>
            </div>
            <p className="px-4 py-3.5 text-[15px] text-foreground leading-relaxed">{description}</p>
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
              background: AMBER_BG,
              border: `1.5px solid ${AMBER_BORDER}`,
              boxShadow: `0 4px 20px hsl(38 88% 50% / 0.12)`,
            }}
          >
            <div
              className="flex items-center gap-2 px-4 py-2.5 border-b"
              style={{ borderColor: AMBER_BORDER }}
            >
              <span className="material-symbols-outlined filled text-[16px]" style={{ color: AMBER }}>format_quote</span>
              <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: AMBER }}>Word from the Owner</span>
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
            <p className="text-[11px] text-muted-foreground font-medium">Item Owner</p>
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
          style={{ background: 'hsl(197 84% 44% / 0.07)', border: '1px solid hsl(197 84% 44% / 0.18)' }}
        >
          <span className="material-symbols-outlined filled text-[17px] flex-shrink-0 mt-0.5" style={{ color: '#06B6D4' }}>
            info
          </span>
          <p className="text-[13px] text-muted-foreground leading-relaxed">
            You found a WeSafe-protected item. The owner has been notified. Please use the buttons below to reach them.
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
              background: 'linear-gradient(135deg, hsl(237 46% 50%) 0%, hsl(237 46% 64%) 100%)',
              boxShadow: '0 6px 20px hsl(237 46% 62% / 0.38), inset 0 1px 0 rgba(255,255,255,0.18)',
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
            Secured by <span className="font-semibold" style={{ color: AMBER }}>WeSafe QR</span>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
