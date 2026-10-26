import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { Mail, Lock, LogIn, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

export default function LoginCliente() {
  const navigate = useNavigate();
  const [credenciais, setCredenciais] = useState({ email: '', senha: '' });
  const [status, setStatus] = useState({ loading: false, error: '', success: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredenciais({ ...credenciais, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: '', success: '' });

    try {
      const response = await api.post('/clientes/login', credenciais);
      
      if (response.data && response.data.id) {
        localStorage.setItem('clienteLogadoId', response.data.id);
        localStorage.setItem('clienteLogadoNome', response.data.nome);

        setStatus({ loading: false, error: '', success: 'Login efetuado com sucesso! Redirecionando...' });
        
        setTimeout(() => {
          navigate('/dashboard');
        }, 1200);
      }
    } catch (error) {
      console.error('Erro no login:', error);
      const mensagem = error.response?.data || 'E-mail ou senha inválidos.';
      setStatus({ loading: false, error: mensagem, success: '' });
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-2xl space-y-6 relative">
        
        <button 
          onClick={() => navigate('/')}
          className="absolute top-4 left-4 text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar
        </button>

        <div className="text-center pt-4">
          <span className="text-3xl">✨</span>
          <h2 className="text-2xl font-serif font-bold text-rose-300 mt-2">ENTRAR NA SUA CONTA</h2>
          <p className="text-xs text-neutral-400 mt-1">Aceda ao seu painel na Vitrine Delas</p>
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

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-300 uppercase mb-1 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-rose-400" /> E-mail
            </label>
            <input 
              type="email" 
              name="email"
              value={credenciais.email}
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
              value={credenciais.senha}
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
            {status.loading ? 'A entrar...' : <> <LogIn className="w-4 h-4" /> Entrar </>}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-neutral-800 text-xs text-neutral-400">
          Ainda não tem conta? <Link to="/registro" className="text-rose-400 hover:underline font-bold">Cadastre-se</Link>
        </div>

      </div>
    </div>
  );
}