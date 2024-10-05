
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthContextProvider } from './context/AuthContext.jsx'
import { DisbursementContextProvider } from './context/DisbursementContext.jsx'
import { OpDisbursementContextProvider } from './context/OpDisbursementContext.jsx'

createRoot(document.getElementById('root')).render(
  <OpDisbursementContextProvider>
    <DisbursementContextProvider>
      <AuthContextProvider>
          <App />
      </AuthContextProvider>
    </DisbursementContextProvider>
  </OpDisbursementContextProvider>

)
