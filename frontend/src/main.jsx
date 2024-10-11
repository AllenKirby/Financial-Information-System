
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthContextProvider } from './context/AuthContext.jsx'
import { DisbursementContextProvider } from './context/DisbursementContext.jsx'
import { OpDisbursementContextProvider } from './context/OpDisbursementContext.jsx'
import { HeadDisbursementContextProvider } from './context/HeadDisbursementContext.jsx'

createRoot(document.getElementById('root')).render(
  <HeadDisbursementContextProvider>
    <OpDisbursementContextProvider>
      <DisbursementContextProvider>
        <AuthContextProvider>
            <App />
        </AuthContextProvider>
      </DisbursementContextProvider>
    </OpDisbursementContextProvider>
  </HeadDisbursementContextProvider>
)
