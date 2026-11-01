import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import PerfilCliente from './components/PerfilCliente.jsx'
import LoginCliente from './components/LoginCliente.jsx'
import RegistroCliente from './components/RegistroCliente.jsx'
import DetalhesProduto from './components/DetalhesProduto.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/dashboard" element={<PerfilCliente />} />
        <Route path="/login" element={<LoginCliente />} />
        <Route path="/registro" element={<RegistroCliente />} />
        <Route path="/produto/:id" element={<DetalhesProduto />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)