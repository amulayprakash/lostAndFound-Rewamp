import { useRef, useState, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

// ─── Animation presets ────────────────────────────────────────────────────────

const SPRING = { type: 'spring', stiffness: 100, damping: 20 }

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: SPRING },
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function useScrolled() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])
  return scrolled
}

function SectionReveal({ children, className = '', delay = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px 0px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ ...SPRING, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function StaggerReveal({ children, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px 0px' })
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={staggerContainer}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ─── NavBar ───────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How it Works', href: '#how-it-works' },
  { label: 'Stories', href: '#testimonials' },
]

function NavBar() {
  const scrolled = useScrolled()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...SPRING, delay: 0.1 }}
      className="fixed top-0 left-0 right-0 z-50 px-4 pt-4"
    >
      <div
        className="max-w-7xl mx-auto rounded-2xl transition-all duration-300"
        style={{
          background: scrolled ? 'hsl(var(--card) / 0.92)' : 'hsl(var(--background) / 0.72)',
          backdropFilter: 'blur(28px) saturate(180%)',
          border: '1px solid hsl(var(--border) / 0.5)',
          boxShadow: scrolled
            ? '0 4px 24px hsl(237 46% 62% / 0.08), 0 1px 4px rgba(0,0,0,0.06)'
            : 'none',
        }}
      >
        <div className="px-5 h-14 flex items-center gap-4">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div
              className="w-8 h-8 rounded-[10px] overflow-hidden flex-shrink-0 transition-transform duration-200 group-hover:scale-105"
              style={{ boxShadow: '0 2px 8px hsl(237 46% 62% / 0.28)' }}
            >
              <img src="/logo1.png" alt="WeSafe QR" className="w-full h-full object-contain" />
            </div>
            <span className="text-sm font-bold text-foreground tracking-tight">WeSafe QR</span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5 ml-4 flex-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-accent/70 transition-all duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <a
              href="https://web.wesafeqr.com"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all duration-200 active:scale-95 hover:-translate-y-px"
              style={{
                background: 'hsl(var(--primary))',
                boxShadow: '0 4px 16px hsl(237 46% 62% / 0.30), inset 0 1px 0 rgba(255,255,255,0.15)',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>shield</span>
              Get Protected
            </a>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center hover:bg-accent/60 transition-colors"
              aria-label="Toggle menu"
            >
              <span className="material-symbols-outlined text-foreground" style={{ fontSize: 20 }}>
                {menuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden border-t border-border/40"
            >
              <div className="px-5 py-3 flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="px-3 py-2.5 rounded-xl text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
                <a
                  href="https://web.wesafeqr.com"
                  className="mt-1.5 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all active:scale-95"
                  style={{ background: 'hsl(var(--primary))', boxShadow: '0 4px 16px hsl(237 46% 62% / 0.25)' }}
                >
                  Get Protected Free
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}

// ─── Phone Mockup (Hero Visual) ───────────────────────────────────────────────

function ScanLine() {
  return (
    <motion.div
      className="absolute left-5 right-5 h-[2px] rounded-full pointer-events-none"
      style={{
        top: '18%',
        background: 'linear-gradient(90deg, transparent, hsl(237 46% 62% / 0.9), transparent)',
      }}
      animate={{ y: [0, 100, 0] }}
      transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

function PhoneMockup() {
  return (
    <div className="relative flex items-center justify-center py-8">
      {/* Ambient glow */}
      <div
        className="absolute w-80 h-80 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, hsl(237 46% 62% / 0.16) 0%, transparent 68%)' }}
      />

      {/* Floating card — items returned */}
      <motion.div
        initial={{ opacity: 0, x: -24, scale: 0.9 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ ...SPRING, delay: 1.0 }}
        className="absolute -left-4 sm:-left-10 top-14 z-10"
      >
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
          className="flex items-center gap-2.5 pl-2.5 pr-3.5 py-2 rounded-2xl"
          style={{
            background: 'hsl(var(--card) / 0.95)',
            backdropFilter: 'blur(16px)',
            border: '1px solid hsl(var(--border) / 0.55)',
            boxShadow: '0 8px 24px hsl(237 46% 62% / 0.12), 0 2px 8px rgba(0,0,0,0.06)',
          }}
        >
          <div
            className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'hsl(160 76% 38% / 0.12)' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 15, color: '#169E6F' }}>check_circle</span>
          </div>
          <div className="leading-tight">
            <p className="text-[9px] text-muted-foreground font-medium">Returned</p>
            <p className="text-[11px] font-bold text-foreground">47,284 items</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Floating card — avg response */}
      <motion.div
        initial={{ opacity: 0, x: 24, scale: 0.9 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ ...SPRING, delay: 1.25 }}
        className="absolute -right-4 sm:-right-8 bottom-20 z-10"
      >
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
          className="flex items-center gap-2.5 pl-2.5 pr-3.5 py-2 rounded-2xl"
          style={{
            background: 'hsl(var(--card) / 0.95)',
            backdropFilter: 'blur(16px)',
            border: '1px solid hsl(var(--border) / 0.55)',
            boxShadow: '0 8px 24px hsl(237 46% 62% / 0.10), 0 2px 8px rgba(0,0,0,0.05)',
          }}
        >
          <div
            className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'hsl(237 46% 62% / 0.10)' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 15, color: '#6C72CC' }}>timer</span>
          </div>
          <div className="leading-tight">
            <p className="text-[9px] text-muted-foreground font-medium">Avg. Return</p>
            <p className="text-[11px] font-bold text-foreground">3.7 min</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Phone frame */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
        className="relative w-[210px] h-[430px] rounded-[40px] overflow-hidden"
        style={{
          background: '#ffffff',
          border: '7px solid hsl(237 40% 12% / 0.09)',
          boxShadow: '0 40px 80px -16px hsl(237 46% 62% / 0.26), 0 12px 32px -8px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.8)',
        }}
      >
        {/* Status bar */}
        <div className="flex justify-between items-center px-5 pt-3 pb-1.5">
          <span className="text-[8px] font-bold text-foreground/50">9:41</span>
          <div className="flex items-center gap-[3px]">
            <div className="w-2.5 h-[5px] rounded-sm" style={{ background: 'hsl(var(--foreground) / 0.35)' }} />
            <div className="w-2.5 h-[5px] rounded-sm" style={{ background: 'hsl(var(--foreground) / 0.35)' }} />
            <div className="w-2.5 h-[5px] rounded-sm" style={{ background: 'hsl(var(--foreground) / 0.18)' }} />
          </div>
        </div>

        {/* App bar */}
        <div className="px-4 pb-2 flex items-center gap-2">
          <div
            className="w-[22px] h-[22px] rounded-lg overflow-hidden flex-shrink-0"
            style={{ boxShadow: '0 1px 4px hsl(237 46% 62% / 0.22)' }}
          >
            <img src="/logo1.png" alt="" className="w-full h-full object-contain" />
          </div>
          <span className="text-[9px] font-bold text-foreground tracking-tight">WeSafe QR</span>
          <div
            className="ml-auto flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[7px] font-bold"
            style={{ background: 'hsl(160 76% 38% / 0.10)', color: '#169E6F', border: '1px solid hsl(160 76% 38% / 0.18)' }}
          >
            <div className="w-1 h-1 rounded-full bg-[#169E6F] animate-pulse" />
            Live
          </div>
        </div>

        {/* QR Scanner */}
        <div
          className="mx-3 rounded-2xl overflow-hidden relative"
          style={{ height: 164, background: 'hsl(237 40% 10%)' }}
        >
          {/* Corner brackets */}
          {[
            'top-2.5 left-2.5 border-t-[2px] border-l-[2px]',
            'top-2.5 right-2.5 border-t-[2px] border-r-[2px]',
            'bottom-2.5 left-2.5 border-b-[2px] border-l-[2px]',
            'bottom-2.5 right-2.5 border-b-[2px] border-r-[2px]',
          ].map((cls, i) => (
            <div
              key={i}
              className={`absolute w-4 h-4 ${cls} rounded-sm`}
              style={{ borderColor: '#6C72CC' }}
            />
          ))}
          {/* QR dot grid */}
          <div
            className="absolute inset-0 flex items-center justify-center"
          >
            <div
              className="w-[72px] h-[72px] rounded-lg opacity-30"
              style={{
                backgroundImage: 'repeating-linear-gradient(0deg, #6C72CC 0px, #6C72CC 2px, transparent 2px, transparent 9px), repeating-linear-gradient(90deg, #6C72CC 0px, #6C72CC 2px, transparent 2px, transparent 9px)',
              }}
            />
          </div>
          <ScanLine />
          <div className="absolute bottom-2 left-0 right-0 text-center">
            <span className="text-[7px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Point camera at QR
            </span>
          </div>
        </div>

        {/* Found card */}
        <motion.div
          className="mx-3 mt-2.5 rounded-2xl px-3 py-2.5"
          style={{
            background: 'hsl(160 76% 38% / 0.07)',
            border: '1px solid hsl(160 76% 38% / 0.18)',
          }}
          animate={{ scale: [1, 1.015, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'hsl(160 76% 38% / 0.14)' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 14, color: '#169E6F' }}>inventory_2</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[7px] font-bold uppercase tracking-wider" style={{ color: '#169E6F' }}>Item Found</p>
              <p className="text-[9px] font-bold text-foreground truncate">Samira's Laptop Bag</p>
            </div>
            <div
              className="px-1.5 py-0.5 rounded-full text-[7px] font-bold"
              style={{ background: 'hsl(160 76% 38% / 0.12)', color: '#169E6F' }}
            >
              Now
            </div>
          </div>
        </motion.div>

        {/* Action buttons */}
        <div className="mx-3 mt-2 grid grid-cols-2 gap-1.5">
          <div
            className="h-8 rounded-xl flex items-center justify-center gap-1.5"
            style={{ background: 'hsl(160 76% 38% / 0.08)', border: '1px solid hsl(160 76% 38% / 0.18)' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 11, color: '#169E6F' }}>call</span>
            <span className="text-[8px] font-bold" style={{ color: '#169E6F' }}>Call Owner</span>
          </div>
          <div
            className="h-8 rounded-xl flex items-center justify-center gap-1.5"
            style={{ background: 'hsl(237 46% 62% / 0.08)', border: '1px solid hsl(237 46% 62% / 0.18)' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 11, color: '#6C72CC' }}>chat</span>
            <span className="text-[8px] font-bold" style={{ color: '#6C72CC' }}>Message</span>
          </div>
        </div>

        {/* Owner info */}
        <div className="mx-3 mt-2 flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/40">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold text-white flex-shrink-0"
            style={{ background: '#6C72CC' }}
          >
            SR
          </div>
          <div className="min-w-0">
            <p className="text-[8px] font-bold text-foreground truncate">Samira Rathod</p>
            <p className="text-[7px] text-muted-foreground">Verified Owner</p>
          </div>
          <div
            className="ml-auto px-1.5 py-0.5 rounded-full text-[6px] font-bold flex items-center gap-0.5"
            style={{ background: 'hsl(160 76% 38% / 0.10)', color: '#169E6F' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 8 }}>verified</span>
            Verified
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section className="min-h-[100dvh] relative overflow-hidden flex items-center">
      {/* Background radial — top right */}
      <div
        className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full pointer-events-none opacity-50"
        style={{ background: 'radial-gradient(circle, hsl(237 46% 62% / 0.13) 0%, transparent 60%)' }}
      />
      {/* Background radial — bottom left */}
      <div
        className="absolute bottom-0 -left-32 w-72 h-72 rounded-full pointer-events-none opacity-30"
        style={{ background: 'radial-gradient(circle, hsl(350 82% 60% / 0.10) 0%, transparent 60%)' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 w-full pt-28 pb-16 lg:pt-36 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-10 lg:gap-20 items-center">

          {/* Left: Copy */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-xl"
          >
            {/* Live badge */}
            <motion.div variants={fadeUp} className="mb-6">
              <span
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider"
                style={{
                  background: 'hsl(var(--primary) / 0.07)',
                  border: '1px solid hsl(var(--primary) / 0.18)',
                  color: 'hsl(var(--primary))',
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: '#6C72CC', animation: 'pulse-soft 2.5s ease-in-out infinite' }}
                />
                Now with Car Protection
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              className="font-bold leading-[1.04] tracking-tight text-foreground mb-5"
              style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)' }}
            >
              Smart tags.
              <br />
              <span style={{ color: '#6C72CC' }}>Instant</span> returns.
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={fadeUp}
              className="text-base text-muted-foreground leading-relaxed max-w-[54ch] mb-8"
            >
              Attach a WeSafe QR code to anything that matters. When someone finds it, they scan, connect, and return it — no app required, no personal info exposed.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-3 mb-10">
              <a
                href="https://web.wesafeqr.com"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold text-white transition-all duration-200 active:scale-95 hover:-translate-y-0.5"
                style={{
                  background: 'hsl(var(--primary))',
                  boxShadow: '0 6px 24px hsl(237 46% 62% / 0.32), inset 0 1px 0 rgba(255,255,255,0.18)',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>qr_code_2</span>
                Get Your Free Tags
              </a>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold text-foreground transition-all duration-200 hover:bg-accent/60 active:scale-95"
                style={{
                  background: 'hsl(var(--secondary))',
                  border: '1px solid hsl(var(--border) / 0.55)',
                }}
              >
                See how it works
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_forward</span>
              </a>
            </motion.div>

            {/* Social proof */}
            <motion.div variants={fadeUp} className="flex items-center gap-4 flex-wrap">
              <div className="flex -space-x-2">
                {[
                  { bg: '#6C72CC', init: 'KN' },
                  { bg: '#F03758', init: 'AM' },
                  { bg: '#10B981', init: 'PK' },
                  { bg: '#F59E0B', init: 'SR' },
                ].map(({ bg, init }) => (
                  <div
                    key={init}
                    className="w-8 h-8 rounded-full border-[2px] border-background flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0"
                    style={{ background: bg }}
                  >
                    {init}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">47,284 items returned</p>
                <p className="text-xs text-muted-foreground">Trusted across India</p>
              </div>
              <div className="hidden sm:block w-px h-8 bg-border/50" />
              <div className="hidden sm:flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="material-symbols-outlined" style={{ fontSize: 14, color: '#F59E0B' }}>star</span>
                ))}
                <span className="text-xs font-bold text-foreground ml-1">4.9</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Phone visual */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.94 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ ...SPRING, delay: 0.35 }}
            className="flex justify-center lg:justify-end"
          >
            <PhoneMockup />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ─── Stats Bar ────────────────────────────────────────────────────────────────

const STATS = [
  { value: '47,284+', label: 'Items returned', icon: 'inventory_2', color: '#6C72CC' },
  { value: '98.3%', label: 'Return success rate', icon: 'verified', color: '#10B981' },
  { value: '3.7 min', label: 'Avg. response time', icon: 'timer', color: '#F59E0B' },
  { value: '12 cities', label: 'Active across India', icon: 'location_on', color: '#F03758' },
]

function StatsBar() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  return (
    <div ref={ref} className="border-y border-border/40" style={{ background: 'hsl(var(--card) / 0.55)', backdropFilter: 'blur(8px)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-border/40">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ ...SPRING, delay: i * 0.1 }}
              className="px-5 py-5 flex items-center gap-3"
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${stat.color}15` }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18, color: stat.color }}>
                  {stat.icon}
                </span>
              </div>
              <div>
                <p className="text-lg font-bold text-foreground tracking-tight leading-none">{stat.value}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── How It Works — step SVG animations ──────────────────────────────────────

function QRTagScene() {
  return (
    <div className="w-full h-full flex items-center justify-center relative select-none p-4">
      {/* Ambient glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div style={{ width: 220, height: 220, borderRadius: '50%', background: 'radial-gradient(circle, #6C72CC28 0%, transparent 68%)' }} />
      </div>

      <div className="relative flex flex-col items-center gap-5 z-10">
        {/* QR card */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: 130, height: 130, borderRadius: 20,
            background: 'white',
            boxShadow: '0 12px 40px #6C72CC35, 0 2px 8px rgba(0,0,0,0.08)',
            padding: 12, position: 'relative', overflow: 'hidden',
          }}
        >
          {/* Shimmer sweep */}
          <motion.div
            style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(120deg, transparent 30%, rgba(108,114,204,0.15) 50%, transparent 70%)',
            }}
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 1.5, ease: 'easeInOut' }}
          />
          <svg width="106" height="106" viewBox="0 0 106 106" fill="none">
            {/* Finder TL */}
            <rect x="3" y="3" width="32" height="32" rx="5" stroke="#6C72CC" strokeWidth="3" />
            <rect x="10" y="10" width="18" height="18" rx="2" fill="#6C72CC" />
            {/* Finder TR */}
            <rect x="71" y="3" width="32" height="32" rx="5" stroke="#6C72CC" strokeWidth="3" />
            <rect x="78" y="10" width="18" height="18" rx="2" fill="#6C72CC" />
            {/* Finder BL */}
            <rect x="3" y="71" width="32" height="32" rx="5" stroke="#6C72CC" strokeWidth="3" />
            <rect x="10" y="78" width="18" height="18" rx="2" fill="#6C72CC" />
            {/* Data dots — center block */}
            {[
              [42,3],[50,3],[58,3],[42,11],[58,11],[42,19],[50,19],[58,19],[42,27],[50,27],[42,35],[50,35],[58,35],
              [42,43],[50,43],[58,43],[66,43],[74,43],[82,43],[90,43],[98,43],
              [42,51],[58,51],[66,51],[82,51],[98,51],
              [42,59],[50,59],[58,59],[74,59],[82,59],[90,59],
              [42,67],[58,67],[66,67],[90,67],[98,67],
              [42,75],[50,75],[66,75],[74,75],[82,75],[98,75],
              [42,83],[58,83],[66,83],[74,83],[90,83],
              [42,91],[50,91],[58,91],[66,91],[82,91],[90,91],[98,91],
              [3,43],[11,43],[19,43],[27,43],[35,43],[3,51],[19,51],[27,51],[35,51],
              [3,59],[11,59],[27,59],[3,67],[11,67],[19,67],[27,67],[35,67],
              [3,75],[19,75],[27,75],[3,83],[11,83],[19,83],[35,83],[3,91],[11,91],[27,91],[35,91],
            ].map(([x, y], idx) => (
              <motion.rect
                key={idx} x={x} y={y} width="6" height="6" rx="1" fill="#6C72CC"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + idx * 0.008, duration: 0.18, ease: 'easeOut' }}
              />
            ))}
          </svg>
        </motion.div>

        {/* Encrypted badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.75, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.7, type: 'spring', stiffness: 220, damping: 16 }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl"
          style={{ background: '#6C72CC', boxShadow: '0 6px 20px #6C72CC45' }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 6.5V4.5C3 2.567 4.567 1 6.5 1S10 2.567 10 4.5V6.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            <rect x="2" y="6" width="10" height="7" rx="2" fill="white" fillOpacity="0.25" stroke="white" strokeWidth="1.2" />
            <circle cx="6.5" cy="9.5" r="1.2" fill="white" />
          </svg>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'white' }}>Encrypted to your profile</span>
        </motion.div>
      </div>
    </div>
  )
}

function ScannerScene() {
  return (
    <div className="w-full h-full flex items-center justify-center relative select-none p-4">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div style={{ width: 220, height: 220, borderRadius: '50%', background: 'radial-gradient(circle, #8B5CF628 0%, transparent 68%)' }} />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-4">
        {/* Phone frame */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
          style={{
            width: 120, height: 160, borderRadius: 20,
            background: '#1a1a2e',
            boxShadow: '0 14px 44px #8B5CF640, 0 3px 10px rgba(0,0,0,0.18)',
            border: '3px solid #2d2d4e',
            padding: 8,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
          }}
        >
          {/* Notch */}
          <div style={{ width: 36, height: 6, borderRadius: 3, background: '#2d2d4e', marginBottom: 2 }} />

          {/* Camera viewfinder */}
          <div style={{
            width: '100%', flex: 1, borderRadius: 12,
            background: '#0d0d1a',
            position: 'relative', overflow: 'hidden',
          }}>
            {/* Corner brackets */}
            {[
              { top: 8, left: 8, borderTop: '2px solid #8B5CF6', borderLeft: '2px solid #8B5CF6', width: 14, height: 14, borderRadius: 2 },
              { top: 8, right: 8, borderTop: '2px solid #8B5CF6', borderRight: '2px solid #8B5CF6', width: 14, height: 14, borderRadius: 2 },
              { bottom: 8, left: 8, borderBottom: '2px solid #8B5CF6', borderLeft: '2px solid #8B5CF6', width: 14, height: 14, borderRadius: 2 },
              { bottom: 8, right: 8, borderBottom: '2px solid #8B5CF6', borderRight: '2px solid #8B5CF6', width: 14, height: 14, borderRadius: 2 },
            ].map((s, i) => (
              <div key={i} style={{ position: 'absolute', ...s }} />
            ))}

            {/* Mini QR in viewfinder */}
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="50" height="50" viewBox="0 0 50 50" fill="none" opacity={0.55}>
                <rect x="2" y="2" width="16" height="16" rx="2" stroke="#8B5CF6" strokeWidth="2" />
                <rect x="5" y="5" width="10" height="10" rx="1" fill="#8B5CF6" />
                <rect x="32" y="2" width="16" height="16" rx="2" stroke="#8B5CF6" strokeWidth="2" />
                <rect x="35" y="5" width="10" height="10" rx="1" fill="#8B5CF6" />
                <rect x="2" y="32" width="16" height="16" rx="2" stroke="#8B5CF6" strokeWidth="2" />
                <rect x="5" y="35" width="10" height="10" rx="1" fill="#8B5CF6" />
                {[[22,2],[28,2],[22,8],[28,8],[22,14],[28,14],[22,20],[28,20],[22,26],[28,26],[34,20],[40,20],[46,20],[34,26],[46,26],[34,32],[40,32],[34,38],[40,38],[46,38],[34,44],[40,44],[46,44],[22,32],[28,32],[22,38],[28,38],[22,44],[28,44]].map(([x,y],i)=>(
                  <rect key={i} x={x} y={y} width="4" height="4" rx="0.5" fill="#8B5CF6" />
                ))}
              </svg>
            </div>

            {/* Scan line */}
            <motion.div
              style={{
                position: 'absolute', left: 10, right: 10, height: 2, borderRadius: 1,
                background: 'linear-gradient(90deg, transparent, #8B5CF6, transparent)',
                boxShadow: '0 0 8px #8B5CF6',
              }}
              animate={{ top: ['15%', '80%', '15%'] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>

        {/* Success chip */}
        <motion.div
          animate={{ opacity: [0, 1, 1, 0], scale: [0.8, 1, 1, 0.8], y: [4, 0, 0, -4] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 1.2, ease: 'easeInOut' }}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl"
          style={{ background: '#8B5CF6', boxShadow: '0 5px 18px #8B5CF645' }}
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <circle cx="6.5" cy="6.5" r="6" stroke="white" strokeWidth="1.2" />
            <path d="M3.5 6.5L5.5 8.5L9.5 4.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'white' }}>QR matched · Page loading</span>
        </motion.div>
      </div>
    </div>
  )
}

function ConnectScene() {
  return (
    <div className="w-full h-full flex items-center justify-center relative select-none p-4">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div style={{ width: 220, height: 220, borderRadius: '50%', background: 'radial-gradient(circle, #10B98128 0%, transparent 68%)' }} />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-5">
        {/* Notification bell with rings */}
        <div className="relative flex items-center justify-center">
          {/* Expanding rings */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              style={{
                position: 'absolute',
                width: 56, height: 56, borderRadius: '50%',
                border: '1.5px solid #10B981',
              }}
              animate={{ scale: [1, 2.4], opacity: [0.6, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.65, ease: 'easeOut' }}
            />
          ))}
          {/* Bell icon container */}
          <motion.div
            animate={{ rotate: [0, -12, 12, -8, 8, 0] }}
            transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 2.5, ease: 'easeInOut' }}
            style={{
              width: 68, height: 68, borderRadius: 20,
              background: 'white',
              boxShadow: '0 10px 36px #10B98138, 0 2px 8px rgba(0,0,0,0.07)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
              <path d="M17 4C17 4 10 7 10 16v5H7v2h20v-2h-3v-5c0-9-7-12-7-12Z" fill="#10B981" fillOpacity="0.18" stroke="#10B981" strokeWidth="1.8" strokeLinejoin="round" />
              <path d="M14 23v1a3 3 0 006 0v-1" stroke="#10B981" strokeWidth="1.8" strokeLinecap="round" />
              <circle cx="24" cy="9" r="5" fill="#F03758" />
              <text x="24" y="13" textAnchor="middle" fontSize="7" fontWeight="800" fill="white">1</text>
            </svg>
          </motion.div>
        </div>

        {/* Chat bubbles */}
        <div className="flex flex-col gap-2 w-full max-w-[200px]">
          <motion.div
            initial={{ opacity: 0, x: -16, scale: 0.85 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 200, damping: 16 }}
            style={{
              alignSelf: 'flex-start',
              background: 'white',
              border: '1px solid #10B98130',
              borderRadius: '14px 14px 14px 4px',
              padding: '8px 12px',
              boxShadow: '0 3px 12px #10B98118',
            }}
          >
            <p style={{ fontSize: 11, fontWeight: 600, color: '#10B981', marginBottom: 1 }}>Finder</p>
            <p style={{ fontSize: 12, fontWeight: 500, color: '#1a1f3a' }}>I found your bag at CST!</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 16, scale: 0.85 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ delay: 0.9, type: 'spring', stiffness: 200, damping: 16 }}
            style={{
              alignSelf: 'flex-end',
              background: '#10B981',
              borderRadius: '14px 14px 4px 14px',
              padding: '8px 12px',
              boxShadow: '0 4px 14px #10B98138',
            }}
          >
            <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: 1 }}>You</p>
            <p style={{ fontSize: 12, fontWeight: 500, color: 'white' }}>Coming in 10 min 🙏</p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

const STEPS = [
  {
    num: '01',
    title: 'Attach a QR tag',
    desc: 'Stick or tie a WeSafe QR label to your bag, luggage, car, or any valuable. Each code is uniquely encrypted to your profile.',
    icon: 'sell',
    color: '#6C72CC',
    bg: 'linear-gradient(140deg, #6C72CC22 0%, #6C72CC0a 60%, transparent 100%)',
    border: '#6C72CC38',
    shadow: '#6C72CC22',
    Visual: QRTagScene,
  },
  {
    num: '02',
    title: 'Finder scans the code',
    desc: 'Anyone who finds your item opens their camera and scans the QR. A smart contact page loads instantly — no app install required.',
    icon: 'qr_code_scanner',
    color: '#8B5CF6',
    bg: 'linear-gradient(140deg, #8B5CF622 0%, #8B5CF60a 60%, transparent 100%)',
    border: '#8B5CF638',
    shadow: '#8B5CF622',
    Visual: ScannerScene,
  },
  {
    num: '03',
    title: 'Connect and retrieve',
    desc: 'You get an instant push notification. The finder can call or message you through an anonymous, encrypted channel — your number stays private.',
    icon: 'notifications_active',
    color: '#10B981',
    bg: 'linear-gradient(140deg, #10B98122 0%, #10B9810a 60%, transparent 100%)',
    border: '#10B98138',
    shadow: '#10B98122',
    Visual: ConnectScene,
  },
]

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <SectionReveal className="mb-16">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">How it works</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight max-w-lg leading-tight">
            From lost to found in three steps
          </h2>
        </SectionReveal>

        <div className="space-y-14">
          {STEPS.map((step, i) => {
            const isReversed = i % 2 !== 0
            const { Visual } = step
            return (
              <SectionReveal key={step.num} delay={i * 0.06}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

                  {/* Visual panel */}
                  <div className={`order-1 ${isReversed ? 'md:order-2' : 'md:order-1'} flex justify-center`}>
                    <motion.div
                      whileHover={{ scale: 1.03, y: -6 }}
                      transition={SPRING}
                      className="w-full max-w-[300px] aspect-square rounded-3xl overflow-hidden relative"
                      style={{
                        background: step.bg,
                        border: `1.5px solid ${step.border}`,
                        boxShadow: `0 16px 48px ${step.shadow}, 0 4px 16px rgba(0,0,0,0.05)`,
                      }}
                    >
                      {/* Step number watermark */}
                      <div
                        className="absolute top-5 left-6 text-7xl font-black leading-none select-none pointer-events-none"
                        style={{ color: `${step.color}22`, letterSpacing: '-0.04em' }}
                      >
                        {step.num}
                      </div>
                      <Visual />
                    </motion.div>
                  </div>

                  {/* Copy */}
                  <div className={`order-2 ${isReversed ? 'md:order-1' : 'md:order-2'}`}>
                    <div className="flex items-center gap-3 mb-5">
                      <div
                        className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                        style={{
                          background: `${step.color}18`,
                          border: `1px solid ${step.color}28`,
                          boxShadow: `0 4px 16px ${step.color}20`,
                        }}
                      >
                        <span className="material-symbols-outlined filled" style={{ fontSize: 22, color: step.color }}>
                          {step.icon}
                        </span>
                      </div>
                      <span
                        className="text-xs font-bold px-3 py-1.5 rounded-full"
                        style={{
                          background: `${step.color}14`,
                          color: step.color,
                          border: `1px solid ${step.color}28`,
                        }}
                      >
                        Step {step.num}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-foreground tracking-tight mb-3">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed max-w-[44ch]">{step.desc}</p>

                    {/* Divider line */}
                    <div
                      className="mt-6 h-[2px] w-16 rounded-full"
                      style={{ background: `linear-gradient(90deg, ${step.color}, transparent)` }}
                    />
                  </div>
                </div>
              </SectionReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ─── Features Bento ───────────────────────────────────────────────────────────

function BentoCard({ title, desc, icon, color, className = '', children }) {
  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: `0 20px 48px ${color}1A, 0 4px 16px rgba(0,0,0,0.06)` }}
      transition={SPRING}
      className={`bg-card rounded-3xl border border-border/55 p-6 overflow-hidden relative ${className}`}
      style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03)' }}
    >
      {/* Top accent */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px] rounded-t-3xl"
        style={{ background: `linear-gradient(90deg, ${color}, transparent 60%)` }}
      />
      <div
        className="w-10 h-10 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: `${color}12` }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 22, color }}>
          {icon}
        </span>
      </div>
      <h3 className="text-[0.9rem] font-bold text-foreground tracking-tight mb-1.5">{title}</h3>
      <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
      {children}
    </motion.div>
  )
}

function FeaturesSection() {
  return (
    <section id="features" className="py-24 px-4 sm:px-8" style={{ background: 'hsl(var(--muted) / 0.28)' }}>
      <div className="max-w-7xl mx-auto">
        <SectionReveal className="mb-14">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Features</p>
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:justify-between">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight max-w-sm leading-tight">
              Everything your belongings need
            </h2>
            <a
              href="https://web.wesafeqr.com"
              className="self-start sm:self-auto inline-flex items-center gap-1.5 text-xs font-bold transition-all duration-200 hover:gap-2.5"
              style={{ color: '#6C72CC' }}
            >
              Explore all features
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
            </a>
          </div>
        </SectionReveal>

        {/* Asymmetric bento — row 1: large + standard */}
        <StaggerReveal className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Large card — spans 2 cols */}
          <motion.div variants={fadeUp} className="sm:col-span-2">
            <BentoCard
              title="Lost & Found QR Tags"
              desc="Uniquely encrypted QR labels that link to a smart contact page. Whoever finds your item can reach you instantly — no app needed, no private details shared."
              icon="qr_code_2"
              color="#6C72CC"
              className="h-full"
            >
              <div className="mt-5">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] text-muted-foreground font-medium">Scanned within 1 hour</span>
                  <span className="text-[10px] font-bold" style={{ color: '#6C72CC' }}>83%</span>
                </div>
                <div
                  className="w-full h-1.5 rounded-full overflow-hidden"
                  style={{ background: 'hsl(237 46% 62% / 0.10)' }}
                >
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: '#6C72CC' }}
                    initial={{ width: 0 }}
                    whileInView={{ width: '83%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.8, delay: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
                  />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {['No app required', 'Private contact', 'Works globally'].map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-full text-[9px] font-bold"
                      style={{ background: 'hsl(237 46% 62% / 0.08)', color: '#6C72CC', border: '1px solid hsl(237 46% 62% / 0.16)' }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </BentoCard>
          </motion.div>

          {/* Car Protection */}
          <motion.div variants={fadeUp}>
            <BentoCard
              title="Car Protection Mode"
              desc="Tag your vehicle. Get instant alerts whenever someone scans the QR sticker — with scan time and location."
              icon="directions_car"
              color="#F59E0B"
              className="h-full"
            >
              <div className="mt-4 flex flex-wrap gap-1.5">
                {['Parking alerts', 'Scan history', 'Geo-tagged'].map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-full text-[8px] font-bold"
                    style={{ background: 'hsl(38 88% 50% / 0.09)', color: '#F59E0B', border: '1px solid hsl(38 88% 50% / 0.18)' }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </BentoCard>
          </motion.div>

          {/* Anonymous Messaging */}
          <motion.div variants={fadeUp}>
            <BentoCard
              title="Anonymous Messaging"
              desc="Finder and owner connect through a temporary encrypted channel. No phone numbers, no exposure."
              icon="lock"
              color="#8B5CF6"
              className="h-full"
            />
          </motion.div>

          {/* Instant Alerts */}
          <motion.div variants={fadeUp}>
            <BentoCard
              title="Instant Alerts"
              desc="Push notification the moment your QR is scanned. Know exactly when your item was found."
              icon="notifications_active"
              color="#F03758"
              className="h-full"
            />
          </motion.div>

          {/* Stats card */}
          <motion.div variants={fadeUp}>
            <div
              className="bg-card rounded-3xl border border-border/55 p-6 h-full relative overflow-hidden"
              style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
            >
              <div
                className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, hsl(160 76% 38% / 0.12) 0%, transparent 70%)' }}
              />
              <div className="space-y-4">
                <div>
                  <p className="text-3xl font-black text-foreground tracking-tighter leading-none">47,284</p>
                  <p className="text-xs text-muted-foreground mt-1">Items successfully returned</p>
                </div>
                <div className="w-full h-px bg-border/40" />
                <div>
                  <p className="text-2xl font-black text-foreground tracking-tighter leading-none" style={{ color: '#10B981' }}>98.3%</p>
                  <p className="text-xs text-muted-foreground mt-1">Return success rate</p>
                </div>
              </div>
            </div>
          </motion.div>
        </StaggerReveal>
      </div>
    </section>
  )
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

const TESTIMONIALS = [
  {
    name: 'Kavya Nair',
    location: 'Mumbai',
    avatarBg: '#6C72CC',
    initials: 'KN',
    text: 'My laptop bag was left on the metro. Someone scanned the WeSafe tag and messaged me through the app in under 4 minutes. Got it back the same evening.',
    item: 'Laptop bag',
  },
  {
    name: 'Arjun Mehta',
    location: 'New Delhi',
    avatarBg: '#10B981',
    initials: 'AM',
    text: "I tagged my car keys and left them at a restaurant. The staff found them, scanned the QR, and reached me through the chat. Zero hassle, zero friction.",
    item: 'Car keys',
  },
  {
    name: 'Priya Krishnan',
    location: 'Bengaluru',
    avatarBg: '#F59E0B',
    initials: 'PK',
    text: "Used it on my daughter's school bag. Two months in, the bag was found and returned in under 10 minutes. Absolute peace of mind.",
    item: "Child's school bag",
  },
]

function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <SectionReveal className="mb-14">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Stories</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight leading-tight">
            Real returns. Real people.
          </h2>
        </SectionReveal>

        <StaggerReveal className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              variants={fadeUp}
              whileHover={{ y: -4 }}
              transition={SPRING}
              className={`bg-card rounded-3xl border border-border/55 p-6 ${i === 1 ? 'md:mt-7' : ''}`}
              style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, j) => (
                  <span key={j} className="material-symbols-outlined" style={{ fontSize: 13, color: '#F59E0B' }}>star</span>
                ))}
              </div>
              <p className="text-sm text-foreground leading-relaxed mb-5">"{t.text}"</p>
              <div className="flex items-center gap-3 pt-4 border-t border-border/40">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                  style={{ background: t.avatarBg }}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.location} · {t.item}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </StaggerReveal>
      </div>
    </section>
  )
}

// ─── CTA Band ─────────────────────────────────────────────────────────────────

function CTASection() {
  return (
    <section className="py-20 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <SectionReveal>
          <div
            className="rounded-3xl px-8 py-14 sm:px-14 relative overflow-hidden"
            style={{
              background: 'linear-gradient(140deg, hsl(237 46% 32%) 0%, hsl(237 46% 50%) 50%, hsl(258 84% 58%) 100%)',
            }}
          >
            {/* Dot texture */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.05]"
              style={{
                backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
                backgroundSize: '22px 22px',
              }}
            />
            {/* Blob */}
            <div
              className="absolute -top-24 -right-24 w-96 h-96 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.07) 0%, transparent 65%)' }}
            />

            <div className="relative z-10 max-w-2xl">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/55 mb-3">Get started</p>
              <h2 className="text-3xl sm:text-[2.4rem] font-bold text-white leading-tight tracking-tight mb-4">
                Your first 3 tags are free.
                <br />No credit card needed.
              </h2>
              <p className="text-sm text-white/65 leading-relaxed mb-8 max-w-[48ch]">
                Set up in under 2 minutes. Join thousands of people who never worry about losing their belongings again.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://web.wesafeqr.com"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-sm font-bold transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
                  style={{
                    color: '#6C72CC',
                    boxShadow: '0 6px 24px rgba(0,0,0,0.14), inset 0 1px 0 rgba(255,255,255,0.9)',
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>qr_code_2</span>
                  Start for Free
                </a>
                <a
                  href="https://web.wesafeqr.com"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold text-white transition-all duration-200 hover:bg-white/10 active:scale-95"
                  style={{ border: '1px solid rgba(255,255,255,0.22)' }}
                >
                  Learn more
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_forward</span>
                </a>
              </div>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────

const FOOTER_LINKS = {
  Product: ['Lost & Found Tags', 'Car Protection', 'How It Works', 'Pricing'],
  Company: ['About WeSafe', 'Blog', 'Press', 'Careers'],
  Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'],
}

function Footer() {
  return (
    <footer className="border-t border-border/40 px-4 sm:px-8 py-14" style={{ background: 'hsl(var(--card) / 0.45)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div
                className="w-9 h-9 rounded-[12px] overflow-hidden flex-shrink-0"
                style={{ boxShadow: '0 2px 8px hsl(237 46% 62% / 0.22)' }}
              >
                <img src="/logo1.png" alt="WeSafe QR" className="w-full h-full object-contain" />
              </div>
              <span className="text-sm font-bold text-foreground">WeSafe QR</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-[30ch]">
              Smart QR protection for everything that matters. Lost items found and returned.
            </p>
          </div>

          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group}>
              <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-4">{group}</p>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="https://web.wesafeqr.com"
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-150"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-8 border-t border-border/40">
          <p className="text-[10px] text-muted-foreground">
            © 2026 WeSafe QR. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-muted-foreground">Secured by</span>
            <div
              className="flex items-center gap-1 px-2 py-0.5 rounded-lg"
              style={{ background: 'hsl(237 46% 62% / 0.08)', border: '1px solid hsl(237 46% 62% / 0.12)' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 11, color: '#6C72CC' }}>shield</span>
              <span className="text-[9px] font-bold" style={{ color: '#6C72CC' }}>WeSafe</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="bg-background min-h-[100dvh]">
      <NavBar />
      <HeroSection />
      <StatsBar />
      <HowItWorks />
      <FeaturesSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  )
}
