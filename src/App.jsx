import { useEffect, lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'

function ExternalRedirect({ to }) {
  useEffect(() => { window.location.replace(to) }, [to])
  return null
}

const LandingPage = lazy(() => import('./pages/LandingPage'))
const QRLandingPage = lazy(() => import('./pages/qr/QRLandingPage'))
const ChatRoom = lazy(() => import('./pages/qr/ChatRoom'))

function PageLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background gap-4">
      {/* Branded logo pulse */}
      <div className="relative">
        <div
          className="absolute inset-0 rounded-[18px] animate-ping opacity-25"
          style={{ background: 'hsl(var(--primary))' }}
        />
        <div
          className="relative w-14 h-14 rounded-[18px] overflow-hidden flex items-center justify-center"
          style={{ boxShadow: '0 4px 20px hsl(237 46% 62% / 0.30)' }}
        >
          <img src="/logo1.png" alt="WeSafe QR" className="w-full h-full object-contain" />
        </div>
      </div>
      {/* Slim progress bar */}
      <div className="w-32 h-[3px] rounded-full overflow-hidden bg-muted">
        <div
          className="h-full rounded-full"
          style={{
            background: 'hsl(var(--primary))',
            animation: 'shimmer 1.4s ease-in-out infinite',
            width: '60%',
          }}
        />
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/qr/:passcode/chat/:roomId" element={<ChatRoom />} />
        <Route path="/qr/:passcode/chat" element={<ChatRoom />} />
        <Route path="/qr/:passcode" element={<QRLandingPage />} />
        <Route path="/:passcode" element={<QRLandingPage />} />
        <Route
          path="*"
          element={<ExternalRedirect to="https://web.wesafeqr.com" />}
        />
      </Routes>
    </Suspense>
  )
}
