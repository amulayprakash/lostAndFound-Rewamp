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
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/qr/:passcode/chat" element={<ChatRoom />} />
        <Route path="/qr/:passcode" element={<QRLandingPage />} />
        <Route
          path="*"
          element={<ExternalRedirect to="https://web.wesafeqr.com" />}
        />
      </Routes>
    </Suspense>
  )
}
