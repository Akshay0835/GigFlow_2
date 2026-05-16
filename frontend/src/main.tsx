import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import axios from 'axios'

const apiUrl = import.meta.env.VITE_API_URL || '';
axios.defaults.baseURL = apiUrl.endsWith('/api/v1') ? apiUrl : `${apiUrl.replace(/\/$/, '')}/api/v1`;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
