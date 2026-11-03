import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import PerfilCliente from './components/PerfilCliente.jsx';
import LoginCliente from './components/LoginCliente.jsx';
import RegistroCliente from './components/RegistroCliente.jsx';
import DetalhesProduto from './components/DetalhesProduto.jsx';
import Sacola from './components/Sacola.jsx';
import PainelAdmin from './components/PainelAdmin.jsx'; // <--- Importe o painel aqui
import ChatWidget from './components/ChatWidget.jsx'; // <--- Importe aqui

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
    <ChatWidget /> {/* <--- Coloque o chat aqui para rodar em todas as rotas */}
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/dashboard" element={<PerfilCliente />} />
        <Route path="/login" element={<LoginCliente />} />
        <Route path="/registro" element={<RegistroCliente />} />
        <Route path="/produto/:id" element={<DetalhesProduto />} />
        <Route path="/sacola" element={<Sacola />} />
        <Route path="/admin" element={<PainelAdmin />} /> {/* <--- Adicione a rota admin aqui */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);