import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            borderRadius: '12px',
            background: 'hsl(237 26% 13%)',
            color: 'hsl(230 18% 95%)',
            fontSize: '14px',
            fontFamily: 'Roboto, system-ui, sans-serif',
          },
        }}
      />
    </BrowserRouter>
  </StrictMode>,
)
