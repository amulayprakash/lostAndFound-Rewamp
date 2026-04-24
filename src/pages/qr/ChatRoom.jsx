import { useEffect, useRef, useState, useCallback } from 'react'
import { useParams, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  getOrCreateRoom,
  sendMessage,
  subscribeMessages,
  verifyOwnerToken,
  sendOwnerWhatsAppNotification,
} from '../../services/chatService'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(ts) {
  if (!ts) return ''
  const date = ts.toDate ? ts.toDate() : new Date(ts)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// ─── Message bubble ────────────────────────────────────────────────────────────

function MessageBubble({ msg, isSelf }) {
  const time = formatTime(msg.createdAt)
  return (
    <div className={`flex ${isSelf ? 'justify-end' : 'justify-start'} mb-1.5`}>
      <div className="max-w-[78%]">
        <div
          className="px-3.5 py-2 text-[14px] leading-relaxed"
          style={
            isSelf
              ? {
                  background: '#DCF8C6',
                  color: '#111',
                  borderRadius: '12px 12px 3px 12px',
                  boxShadow: '0 1px 1px rgba(0,0,0,0.1)',
                }
              : {
                  background: '#fff',
                  color: '#111',
                  borderRadius: '12px 12px 12px 3px',
                  boxShadow: '0 1px 1px rgba(0,0,0,0.1)',
                }
          }
        >
          {msg.text}
          <span className="ml-2 text-[10px] text-gray-400 float-right mt-1 select-none">{time}</span>
        </div>
      </div>
    </div>
  )
}

// ─── Chat background pattern ───────────────────────────────────────────────────

const chatBgStyle = {
  backgroundColor: '#e5ddd5',
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c8b8a2' fill-opacity='0.25'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
}

// ─── Main chat room ────────────────────────────────────────────────────────────

export default function ChatRoom() {
  const { passcode, roomId: roomIdParam } = useParams()
  const { state: navState } = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const itemName = navState?.itemName || 'Item'
  const wordFromOwner = navState?.wordFromOwner || ''
  const ownerName = navState?.ownerName || 'Owner'
  const ownerPhone = navState?.ownerPhone || ''
  const otParam = searchParams.get('ot')

  const [roomState, setRoomState] = useState('loading')
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [senderRole, setSenderRole] = useState('responder')
  // Active roomId used for all Firestore reads/writes
  const [activeRoomId, setActiveRoomId] = useState(roomIdParam || null)

  const bottomRef = useRef(null)
  const inputRef = useRef(null)
  const unsubRef = useRef(null)

  const buildOwnerChatUrl = useCallback((pid, rid, oat) => {
    return `${window.location.origin}/qr/${pid}/chat/${rid}?ot=${oat}`
  }, [])

  useEffect(() => {
    if (!passcode) return

    async function init() {
      try {
        // ── Owner path: opened via WhatsApp link with ?ot= token ──────────────
        if (otParam && roomIdParam) {
          const valid = await verifyOwnerToken(roomIdParam, otParam)
          if (valid) {
            setSenderRole('owner')
            setActiveRoomId(roomIdParam)
            unsubRef.current = subscribeMessages(roomIdParam, setMessages)
            setRoomState('open')
            return
          }
          // Invalid token — fall through to finder flow
        }

        // ── Finder path: every finder gets their own room ─────────────────────
        const result = await getOrCreateRoom(passcode, null, wordFromOwner)
        const rid = result.roomId

        setActiveRoomId(rid)

        // Send WhatsApp BEFORE navigate so it fires on the original mount
        if (result.status === 'created' && rid) {
          const ownerChatUrl = buildOwnerChatUrl(passcode, rid, result.ownerAccessToken)
          sendOwnerWhatsAppNotification(ownerPhone, ownerChatUrl, itemName, ownerName)
        }

        // Push the unique roomId into the URL (replace so back-button skips this step)
        if (rid && !roomIdParam) {
          navigate(`/qr/${passcode}/chat/${rid}`, { replace: true, state: navState })
        }

        unsubRef.current = subscribeMessages(rid, setMessages)
        setRoomState('open')
      } catch {
        toast.error('Could not open chat room.')
        setRoomState('error')
      }
    }

    init()
    return () => { unsubRef.current?.() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [passcode])

  useEffect(() => {
    if (roomState === 'open') {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, roomState])

  const handleSend = async () => {
    const text = input.trim()
    if (!text || sending || !activeRoomId) return
    setSending(true)
    setInput('')
    try {
      await sendMessage(activeRoomId, text, senderRole)
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

  const isOwnerView = senderRole === 'owner'

  return (
    <div className="flex flex-col h-[100dvh]" style={{ background: '#f0f2f5' }}>

      {/* ── Header ── */}
      <header
        className="flex-shrink-0 flex items-center h-[60px] px-3 gap-3"
        style={{ background: '#075E54', color: '#fff' }}
      >
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center w-9 h-9 -ml-1 rounded-full hover:bg-white/10 active:bg-white/20 transition-all duration-150 flex-shrink-0"
          aria-label="Go back"
        >
          <span className="material-symbols-outlined text-[20px] text-white">arrow_back_ios</span>
        </button>

        <div
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-[17px] font-bold"
          style={{ background: '#128C7E', color: '#fff' }}
        >
          {(ownerName || 'O').slice(0, 1).toUpperCase()}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[15px] font-semibold text-white leading-tight truncate">
            {isOwnerView ? 'Finder' : ownerName}
          </p>
          <p className="text-[11px] leading-tight" style={{ color: '#ACE1DA' }}>
            {isOwnerView ? 'Someone found your item' : `About: ${itemName}`}
          </p>
        </div>

        {isOwnerView ? (
          <div
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold flex-shrink-0"
            style={{ background: '#128C7E', color: '#fff' }}
          >
            <span className="material-symbols-outlined filled" style={{ fontSize: 11 }}>verified</span>
            Owner
          </div>
        ) : (
          <div
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}
          >
            <span className="material-symbols-outlined filled" style={{ fontSize: 11 }}>lock</span>
            Secure
          </div>
        )}
      </header>

      {/* ── Body ── */}
      <AnimatePresence mode="wait">

        {roomState === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center gap-3"
            style={{ background: '#e5ddd5' }}
          >
            <div
              className="w-10 h-10 rounded-full animate-spin"
              style={{ border: '2.5px solid rgba(7,94,84,0.2)', borderTopColor: '#075E54' }}
            />
            <p className="text-[14px] text-gray-500">Opening secure chat…</p>
          </motion.div>
        )}

        {roomState === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-5 bg-background"
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

        {roomState === 'open' && (
          <motion.div
            key="open"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex-1 flex flex-col min-h-0"
          >
            {/* Notice strip */}
            <div
              className="flex-shrink-0 flex items-center gap-2 px-4 py-1.5 text-[11px] justify-center"
              style={{ background: '#FFF3CD', borderBottom: '1px solid #FFD966' }}
            >
              <span className="material-symbols-outlined filled text-[13px]" style={{ color: '#856404' }}>lock</span>
              <span style={{ color: '#856404' }}>
                {isOwnerView
                  ? 'You are chatting as the item owner'
                  : 'End-to-end secured · Owner will be notified'}
              </span>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-3 py-3 no-scrollbar" style={chatBgStyle}>
              {messages.length === 0 && (
                <div className="flex items-center justify-center h-full">
                  <div
                    className="px-4 py-2 rounded-xl text-[12px] text-center"
                    style={{ background: 'rgba(255,255,255,0.7)', color: '#555', maxWidth: 220 }}
                  >
                    {isOwnerView
                      ? 'The finder will message you shortly.'
                      : 'Send a message to start the conversation'}
                  </div>
                </div>
              )}
              {messages.map((msg) => {
                const isSelf =
                  (isOwnerView && msg.senderType === 'owner') ||
                  (!isOwnerView && msg.senderType === 'responder')
                return <MessageBubble key={msg.id} msg={msg} isSelf={isSelf} />
              })}
              <div ref={bottomRef} />
            </div>

            {/* Input bar */}
            <div
              className="flex-shrink-0 flex items-end gap-2 px-3 py-2"
              style={{ background: '#f0f2f5', borderTop: '1px solid #d1d7db' }}
            >
              <textarea
                ref={inputRef}
                rows={1}
                placeholder="Type a message"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 resize-none px-4 py-2.5 text-[14px] leading-relaxed focus:outline-none max-h-[120px] overflow-y-auto"
                style={{
                  minHeight: 42,
                  background: '#fff',
                  borderRadius: 24,
                  border: '1px solid #d1d7db',
                  color: '#111',
                }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || sending}
                className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 transition-all active:scale-[0.94] disabled:opacity-40"
                style={{ background: '#075E54' }}
                aria-label="Send message"
              >
                {sending ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span className="material-symbols-outlined filled text-white" style={{ fontSize: 20 }}>send</span>
                )}
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}
