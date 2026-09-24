import React, { useState } from 'react';
import axios from 'axios';

export default function InscricaoForm() {
  const [formData, setFormData] = useState({
    nomeCompleto: '',
    idade: '',
    nomeResponsavel: '',
    telefone: '',
    email: '',
    lojaIndicacao: '',
    fotoUrl: ''
  });

  const [status, setStatus] = useState({ loading: false, error: '', success: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: '', success: '' });

    try {
      // Se estiver testando local use 'http://localhost:8080/inscricoes'
      // Quando subir pro Render, substitua pelo seu link de produção do Render
      await axios.post('http://localhost:8080/inscricoes', formData);
      
      setStatus({ 
        loading: false, 
        error: '', 
        success: 'Cadastro realizado com sucesso! Em breve entraremos em contato.' 
      });
      setFormData({
        nomeCompleto: '',
        idade: '',
        nomeResponsavel: '',
        telefone: '',
        email: '',
        lojaIndicacao: '',
        fotoUrl: ''
      });
    } catch (err) {
      console.error(err);
      setStatus({ 
        loading: false, 
        error: 'Erro ao enviar cadastro. Verifique os dados ou tente novamente mais tarde.', 
        success: '' 
      });
    }
  };

  return (
    <section id="inscricao" className="py-20 px-4 bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 p-8 text-center text-white">
          <h2 className="text-3xl font-black">FAÇA PARTE DESSA HISTÓRIA</h2>
          <p className="text-sm text-pink-100 mt-1">E descubra novos talentos! Preencha o cadastro abaixo:</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {status.success && <div className="p-4 bg-emerald-950 border border-emerald-500 text-emerald-300 rounded-xl text-center font-semibold">{status.success}</div>}
          {status.error && <div className="p-4 bg-rose-950 border border-rose-500 text-rose-300 rounded-xl text-center font-semibold">{status.error}</div>}

          <div>
            <label className="block text-sm font-semibold mb-1 text-slate-300">Nome Completo do Modelo *</label>
            <input 
              type="text" 
              name="nomeCompleto" 
              value={formData.nomeCompleto} 
              onChange={handleChange} 
              required 
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
                min="6" 
                max="15" 
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
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-slate-300">URL da Foto do Modelo</label>
            <input 
              type="url" 
              name="fotoUrl" 
              value={formData.fotoUrl} 
              onChange={handleChange} 
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none text-white placeholder-slate-600" 
              placeholder="https://exemplo.com/sua-foto.jpg" 
            />
          </div>

          <button 
            type="submit" 
            disabled={status.loading} 
            className="w-full py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-extrabold rounded-xl shadow-lg hover:opacity-95 transition mt-6 cursor-pointer tracking-wide uppercase"
          >
            {status.loading ? 'Enviando Cadastro...' : 'GARANTIR MEU CADASTRO'}
          </button>
        </form>
      </div>
    </section>
  );
}