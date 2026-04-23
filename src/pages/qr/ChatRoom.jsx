import { useEffect, useRef, useState } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  getOrCreateRoom,
  sendMessage,
  subscribeMessages,
} from '../../services/chatService'

const PRIMARY = 'hsl(237 46% 62%)'
const PRIMARY_BG = 'hsl(237 46% 62% / 0.10)'
const PRIMARY_BORDER = 'hsl(237 46% 62% / 0.20)'

// ─── Message bubble ────────────────────────────────────────────────────────────

function MessageBubble({ msg, index }) {
  const isOwner = msg.senderType === 'owner'
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.035, duration: 0.28 }}
      className={`flex ${isOwner ? 'justify-start' : 'justify-end'} mb-3`}
    >
      <div className="flex flex-col max-w-[78%]">
        <span className={`text-[10px] font-semibold mb-1 ${isOwner ? 'text-left' : 'text-right'} text-muted-foreground`}>
          {isOwner ? 'Owner' : 'You'}
        </span>
        <div
          className="px-4 py-2.5 text-[14px] leading-relaxed"
          style={
            isOwner
              ? {
                  background: PRIMARY_BG,
                  color: 'hsl(var(--foreground))',
                  border: `1px solid ${PRIMARY_BORDER}`,
                  borderRadius: '16px 16px 16px 4px',
                }
              : {
                  background: 'hsl(var(--muted))',
                  color: 'hsl(var(--foreground))',
                  border: '1px solid hsl(var(--border) / 0.5)',
                  borderRadius: '16px 16px 4px 16px',
                }
          }
        >
          {msg.text}
        </div>
      </div>
    </motion.div>
  )
}

// ─── Claimed screen ────────────────────────────────────────────────────────────

function ClaimedScreen({ wordFromOwner, onBack }) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-6 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
        className="w-20 h-20 rounded-[24px] flex items-center justify-center mb-5"
        style={{ background: 'hsl(38 88% 50% / 0.12)' }}
      >
        <span className="material-symbols-outlined filled text-5xl" style={{ color: '#F59E0B' }}>group</span>
      </motion.div>
      <h2 className="text-xl font-bold tracking-tight mb-2">Already in Contact</h2>
      <p className="text-muted-foreground text-[14px] max-w-xs mb-6 leading-relaxed">
        Someone else is already in contact with the owner about this item. The owner's message is shown below.
      </p>
      {wordFromOwner && (
        <div
          className="w-full max-w-sm rounded-2xl px-5 py-4 mb-6 text-left"
          style={{
            background: 'hsl(38 88% 50% / 0.08)',
            border: '1px solid hsl(38 88% 50% / 0.22)',
          }}
        >
          <p className="text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: '#F59E0B' }}>Owner's Message</p>
          <p className="text-[14px] text-foreground leading-relaxed">"{wordFromOwner}"</p>
        </div>
      )}
      <button
        onClick={onBack}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border/70 text-[14px] font-semibold text-foreground hover:bg-accent active:scale-[0.97] transition-all"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Back to Item
      </button>
    </div>
  )
}

// ─── Main chat room ────────────────────────────────────────────────────────────

export default function ChatRoom() {
  const { passcode } = useParams()
  const { state: navState } = useLocation()
  const navigate = useNavigate()

  const itemName = navState?.itemName || 'Item'
  const wordFromOwner = navState?.wordFromOwner || ''
  const ownerName = navState?.ownerName || 'Owner'

  const [roomState, setRoomState] = useState('loading')
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)
  const unsubRef = useRef(null)

  useEffect(() => {
    if (!passcode) return

    async function init() {
      try {
        const result = await getOrCreateRoom(passcode, null, wordFromOwner)

        if (result.status === 'claimed') {
          setRoomState('claimed')
          return
        }

        unsubRef.current = subscribeMessages(passcode, (msgs) => {
          setMessages(msgs)
        })
        setRoomState('open')
      } catch {
        toast.error('Could not open chat room.')
        setRoomState('error')
      }
    }

    init()
    return () => { unsubRef.current?.() }
  }, [passcode, wordFromOwner])

  useEffect(() => {
    if (roomState === 'open') {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, roomState])

  const handleSend = async () => {
    const text = input.trim()
    if (!text || sending) return
    setSending(true)
    setInput('')
    try {
      await sendMessage(passcode, text, 'responder')
    } catch {
      toast.error('Failed to send message.')
      setInput(text)
    } finally {
      setSending(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-[100dvh] bg-background">

      {/* ── Header — matches WeSafe rewamp Header.jsx exactly ── */}
      <header
        className="flex-shrink-0 flex items-center h-14 px-4 gap-3"
        style={{
          background: 'hsl(var(--background) / 0.88)',
          backdropFilter: 'blur(24px) saturate(200%)',
          WebkitBackdropFilter: 'blur(24px) saturate(200%)',
          borderBottom: '1px solid hsl(var(--border) / 0.7)',
          boxShadow: '0 1px 0 hsl(var(--border) / 0.6), 0 2px 8px hsl(var(--foreground) / 0.03)',
        }}
      >
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center w-9 h-9 -ml-1 rounded-xl hover:bg-accent active:scale-95 transition-all duration-150 flex-shrink-0"
          aria-label="Go back"
        >
          <span className="material-symbols-outlined text-[20px] text-foreground">arrow_back_ios</span>
        </button>

        {/* Chat icon */}
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: PRIMARY_BG }}
        >
          <span className="material-symbols-outlined filled text-[18px]" style={{ color: PRIMARY }}>chat</span>
        </div>

        {/* Title */}
        <div className="flex-1 min-w-0">
          <p className="text-[15px] font-bold text-foreground leading-tight truncate">{itemName}</p>
          <p className="text-[11px] text-muted-foreground leading-tight">Chat with {ownerName}</p>
        </div>

        {/* Secure badge */}
        <div
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[10px] font-bold flex-shrink-0"
          style={{ background: 'hsl(160 76% 38% / 0.10)', color: '#10B981', border: '1px solid hsl(160 76% 38% / 0.22)' }}
        >
          <span className="material-symbols-outlined filled" style={{ fontSize: 11 }}>lock</span>
          Secure
        </div>
      </header>

      {/* ── Body ── */}
      <AnimatePresence mode="wait">

        {/* Loading */}
        {roomState === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center gap-3"
          >
            <div
              className="w-10 h-10 rounded-full animate-spin"
              style={{ border: '2.5px solid hsl(237 46% 62% / 0.2)', borderTopColor: PRIMARY }}
            />
            <p className="text-[14px] text-muted-foreground">Opening secure chat…</p>
          </motion.div>
        )}

        {/* Claimed */}
        {roomState === 'claimed' && (
          <motion.div
            key="claimed"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex-1 flex flex-col"
          >
            <ClaimedScreen wordFromOwner={wordFromOwner} onBack={() => navigate(-1)} />
          </motion.div>
        )}

        {/* Error */}
        {roomState === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-5"
          >
            <div
              className="w-16 h-16 rounded-[20px] flex items-center justify-center"
              style={{ background: 'hsl(350 82% 60% / 0.10)' }}
            >
              <span className="material-symbols-outlined filled text-4xl" style={{ color: 'hsl(350 82% 60%)' }}>error</span>
            </div>
            <div>
              <p className="text-[16px] font-bold text-foreground mb-1">Could not open chat</p>
              <p className="text-[14px] text-muted-foreground">Please go back and try again.</p>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-2.5 rounded-xl border border-border/70 text-[14px] font-semibold text-foreground hover:bg-accent active:scale-[0.97] transition-all"
            >
              Go Back
            </button>
          </motion.div>
        )}

        {/* Open chat */}
        {roomState === 'open' && (
          <motion.div
            key="open"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex-1 flex flex-col min-h-0"
          >
            {/* Notice strip */}
            <div
              className="flex-shrink-0 flex items-center gap-2 px-4 py-2 text-[11px] text-muted-foreground"
              style={{
                background: 'hsl(197 84% 44% / 0.06)',
                borderBottom: '1px solid hsl(var(--border) / 0.5)',
              }}
            >
              <span className="material-symbols-outlined filled text-[13px]" style={{ color: '#06B6D4' }}>info</span>
              Owner will be notified when you send a message
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 no-scrollbar">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
                  <div
                    className="w-14 h-14 rounded-[18px] flex items-center justify-center"
                    style={{ background: PRIMARY_BG }}
                  >
                    <span className="material-symbols-outlined filled text-[30px]" style={{ color: PRIMARY }}>chat_bubble</span>
                  </div>
                  <p className="text-[14px] text-muted-foreground max-w-[180px] leading-relaxed">
                    Send a message to start the conversation
                  </p>
                </div>
              )}
              {messages.map((msg, i) => (
                <MessageBubble key={msg.id} msg={msg} index={i} />
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input bar */}
            <div
              className="flex-shrink-0 flex items-end gap-2.5 px-4 py-3 border-t border-border/60"
              style={{ background: 'hsl(var(--background))' }}
            >
              <textarea
                ref={inputRef}
                rows={1}
                placeholder="Type a message…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 resize-none rounded-2xl border border-border/60 bg-card px-4 py-3 text-[14px] leading-relaxed focus:outline-none focus:ring-2 max-h-[120px] overflow-y-auto"
                style={{
                  minHeight: 46,
                  '--tw-ring-color': 'hsl(237 46% 62% / 0.25)',
                }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || sending}
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all active:scale-[0.94] disabled:opacity-40"
                style={{
                  background: 'linear-gradient(135deg, hsl(237 46% 50%) 0%, hsl(237 46% 64%) 100%)',
                  boxShadow: input.trim()
                    ? '0 4px 14px hsl(237 46% 62% / 0.38), inset 0 1px 0 rgba(255,255,255,0.18)'
                    : 'none',
                }}
                aria-label="Send message"
              >
                {sending ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span className="material-symbols-outlined filled text-white" style={{ fontSize: 18 }}>send</span>
                )}
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}
