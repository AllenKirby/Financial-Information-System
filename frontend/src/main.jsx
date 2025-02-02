
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthContextProvider } from './context/AuthContext.jsx'
import { store } from './redux/store.jsx'
import {Provider} from 'react-redux'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <AuthContextProvider>
        <App />
    </AuthContextProvider>
  </Provider>
)
