import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const Test = () => {
  return <div>
    Hello World
  </div>
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Test/>
  </StrictMode>,
)
