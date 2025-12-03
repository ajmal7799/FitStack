import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.js'
import { Provider } from 'react-redux'
import { store } from './redux/store.js'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

const queryClient = new QueryClient()
createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        < App />
        <Toaster position="top-right" reverseOrder={false} />
      </QueryClientProvider>
    </Provider>
     </GoogleOAuthProvider>
  </StrictMode>,
)
