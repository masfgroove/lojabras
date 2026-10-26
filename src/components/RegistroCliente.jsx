import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { User, Mail, Lock, UserPlus, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

export default function RegistroCliente() {
  const navigate = useNavigate();
  const [novoCliente, setNovoCliente] = useState({
    nome: '',
    email: '',
    senha: ''
  });
  const [status, setStatus] = useState({ loading: false, error: '', success: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNovoCliente({ ...novoCliente, [name]: value });
  };

  const handleRegistro = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: '', success: '' });

    try {
      // Envia os dados para a rota POST /clientes do Spring Boot que já existe
      await api.post('/clientes', novoCliente);

      setStatus({ 
        loading: false, 
        error: '', 
        success: 'Conta criada com sucesso! Redirecionando para o login...' 
      });

      setTimeout(() => {
        navigate('/login');
      }, 1500);

    } catch (error) {
      console.error('Erro ao registrar:', error);
      const mensagem = error.response?.data?.message || 'Erro ao criar conta. Verifique se o e-mail já está em uso.';
      setStatus({ loading: false, error: mensagem, success: '' });
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-2xl space-y-6 relative">
        
        <button 
          onClick={() => navigate('/login')}
          className="absolute top-4 left-4 text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar ao Login
        </button>

        <div className="text-center pt-4">
          <span className="text-3xl">✨</span>
          <h2 className="text-2xl font-serif font-bold text-rose-300 mt-2">CRIAR SUA CONTA</h2>
          <p className="text-xs text-neutral-400 mt-1">Junte-se à Vitrine Delas</p>
        </div>

        {status.success && (
          <div className="p-3 bg-green-950 border border-green-700 text-green-300 rounded-lg text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" /> {status.success}
          </div>
        )}
        {status.error && (
          <div className="p-3 bg-red-950 border border-red-700 text-red-300 rounded-lg text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" /> {status.error}
          </div>
        )}

        <form onSubmit={handleRegistro} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-300 uppercase mb-1 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-rose-400" /> Nome Completo
            </label>
            <input 
              type="text" 
              name="nome"
              value={novoCliente.nome}
              onChange={handleChange}
              required
              placeholder="Seu nome e sobrenome"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 uppercase mb-1 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-rose-400" /> E-mail
            </label>
            <input 
              type="email" 
              name="email"
              value={novoCliente.email}
              onChange={handleChange}
              required
              placeholder="seu.email@exemplo.com"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 uppercase mb-1 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-rose-400" /> Senha
            </label>
            <input 
              type="password" 
              name="senha"
              value={novoCliente.senha}
              onChange={handleChange}
              required
              placeholder="••••••••"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-rose-500"
            />
          </div>

          <button 
            type="submit" 
            disabled={status.loading}
            className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl text-sm transition cursor-pointer shadow-lg flex items-center justify-center gap-2 mt-2"
          >
            {status.loading ? 'A criar conta...' : <> <UserPlus className="w-4 h-4" /> Cadastrar </>}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-neutral-800 text-xs text-neutral-400">
          Já tem uma conta? <Link to="/login" className="text-rose-400 hover:underline font-bold">Faça login</Link>
        </div>

      </div>
    </div>
  );
}