import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from "react-hot-toast";
import { AuthProvider } from './context/AuthContext.tsx'
 import { Provider } from 'react-redux'
import { store } from './redux/store.ts'
import CartLoader from './components/CartLoader.tsx'

createRoot(document.getElementById('root')!).render(
  <>
    <BrowserRouter>
      <AuthProvider>
        <Provider store={store}>
           <CartLoader />
              <App />
        </Provider>
        </AuthProvider>
      <Toaster position="top-right" />
    </BrowserRouter>
  </>,
)
