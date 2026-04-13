import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/pages/index.css'
import App from './App' // ./App.tsx

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)