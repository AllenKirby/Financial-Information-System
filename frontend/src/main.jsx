
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthContextProvider } from './context/AuthContext.jsx'
import { DisbursementContextProvider } from './context/DisbursementContext.jsx'
import { OpDisbursementContextProvider } from './context/OpDisbursementContext.jsx'
import { HeadDisbursementContextProvider } from './context/HeadDisbursementContext.jsx'
import { AdminDisbursementContextProvider } from './context/AdminDisbursementContext.jsx'
import { store } from './redux/store.jsx'
import {Provider} from 'react-redux'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <AdminDisbursementContextProvider>
      <HeadDisbursementContextProvider>
        <OpDisbursementContextProvider>
          <DisbursementContextProvider>
            <AuthContextProvider>
                <App />
            </AuthContextProvider>
          </DisbursementContextProvider>
        </OpDisbursementContextProvider>
      </HeadDisbursementContextProvider>
    </AdminDisbursementContextProvider>
  </Provider>
)
