import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthContextProvider } from './context/AuthContext.jsx'
import { DisbursementContextProvider } from './context/DisbursementContext.jsx'

createRoot(document.getElementById('root')).render(
  <DisbursementContextProvider>
    <AuthContextProvider>
      {/* <StrictMode> */}
        <App />
      {/* </StrictMode>, */}
    </AuthContextProvider>
  </DisbursementContextProvider>
)
