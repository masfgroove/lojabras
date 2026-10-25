import React, { useState } from 'react';
<<<<<<< HEAD
import api from '../services/api';
=======
import api from './services/api'; // Importando a instância centralizada do axios
>>>>>>> 2b1a1db (feat: atualiza front-end integrado com backend do LojaBrás no Render)

export default function ClienteForm() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: ''
  });

  const [status, setStatus] = useState({ loading: false, error: '', success: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: '', success: '' });

    try {
<<<<<<< HEAD
      // Requisita via instância centralizada do Axios
      await api.post('/inscricoes', formData);
=======
      // Faz o POST para a rota /clientes do nosso backend LojaBrás no Render
      await api.post('/clientes', formData);
>>>>>>> 2b1a1db (feat: atualiza front-end integrado com backend do LojaBrás no Render)
      
      setStatus({ 
        loading: false, 
        error: '', 
        success: 'Cliente cadastrado com sucesso! Faça seu login.' 
      });
      
      setFormData({
        nome: '',
        email: '',
        senha: ''
      });
    } catch (err) {
      console.error('Erro no cadastro:', err);
      setStatus({ 
        loading: false, 
        error: 'Erro ao cadastrar cliente. Verifique os dados ou tente novamente.', 
        success: '' 
      });
    }
  };

  return (
    <section id="cadastro-cliente" className="py-20 px-4 bg-neutral-950 text-neutral-100">
      <div className="max-w-md mx-auto bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-rose-600 to-rose-800 p-6 text-center text-white">
          <h2 className="text-2xl font-serif font-bold">CRIAR SUA CONTA</h2>
          <p className="text-xs text-rose-100 mt-1">Cadastre-se para realizar seus pedidos na Vitrine Delas ♥</p>
        </div>

<<<<<<< HEAD
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {status.success && (
            <div className="p-4 bg-emerald-950 border border-emerald-500 text-emerald-300 rounded-xl text-center font-semibold">
              {status.success}
            </div>
          )}
          {status.error && (
            <div className="p-4 bg-rose-950 border border-rose-500 text-rose-300 rounded-xl text-center font-semibold">
              {status.error}
            </div>
          )}
=======
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {status.success && <div className="p-3 bg-green-950 border border-green-700 text-green-300 rounded text-xs text-center font-medium">{status.success}</div>}
          {status.error && <div className="p-3 bg-red-950 border border-red-700 text-red-300 rounded text-xs text-center font-medium">{status.error}</div>}
>>>>>>> 2b1a1db (feat: atualiza front-end integrado com backend do LojaBrás no Render)

          <div>
            <label className="block text-xs font-medium text-neutral-300 uppercase tracking-wider mb-1">Nome Completo *</label>
            <input 
              type="text" 
              name="nome" 
              value={formData.nome} 
              onChange={handleChange} 
              required 
<<<<<<< HEAD
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none text-white placeholder-slate-600" 
              placeholder="Ex: Lucas Silva" 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1 text-slate-300">Idade *</label>
              <input 
                type="number" 
                name="idade" 
                value={formData.idade} 
                onChange={handleChange} 
                required 
                min="1" 
                max="100" 
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none text-white placeholder-slate-600" 
                placeholder="Ex: 12" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-slate-300">Nome do Responsável</label>
              <input 
                type="text" 
                name="nomeResponsavel" 
                value={formData.nomeResponsavel} 
                onChange={handleChange} 
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none text-white placeholder-slate-600" 
                placeholder="Ex: Mariana Silva" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1 text-slate-300">Telefone / WhatsApp *</label>
              <input 
                type="text" 
                name="telefone" 
                value={formData.telefone} 
                onChange={handleChange} 
                required 
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none text-white placeholder-slate-600" 
                placeholder="(11) 98888-7777" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-slate-300">E-mail</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none text-white placeholder-slate-600" 
                placeholder="seu@email.com" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-slate-300">Loja de Indicação / Parceria</label>
            <input 
              type="text" 
              name="lojaIndicacao" 
              value={formData.lojaIndicacao} 
              onChange={handleChange} 
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none text-white placeholder-slate-600" 
              placeholder="Ex: Loja Parceira" 
=======
              className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded text-white text-sm focus:outline-none focus:border-rose-500" 
              placeholder="Ex: Maria Souza" 
>>>>>>> 2b1a1db (feat: atualiza front-end integrado com backend do LojaBrás no Render)
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 uppercase tracking-wider mb-1">E-mail *</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
              className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded text-white text-sm focus:outline-none focus:border-rose-500" 
              placeholder="seu@email.com" 
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 uppercase tracking-wider mb-1">Senha *</label>
            <input 
              type="password" 
              name="senha" 
              value={formData.senha} 
              onChange={handleChange} 
              required 
              className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded text-white text-sm focus:outline-none focus:border-rose-500" 
              placeholder="••••••••" 
            />
          </div>

          <button 
            type="submit" 
            disabled={status.loading} 
            className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-medium rounded text-sm transition cursor-pointer mt-4"
          >
            {status.loading ? 'Cadastrando...' : 'Cadastrar Conta'}
          </button>
        </form>
      </div>
    </section>
  );
}