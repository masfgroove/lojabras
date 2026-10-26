import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { User, MapPin, Phone, FileText, Mail, CheckCircle, AlertCircle, X, LogOut } from 'lucide-react';

export default function PerfilCliente({ onClose }) {
  const navigate = useNavigate();
  // Pega o ID do cliente logado no localStorage
  const clienteId = localStorage.getItem('clienteLogadoId');

  const [cliente, setCliente] = useState({
    nome: '',
    email: '',
    nomePreferencia: '',
    cpf: '',
    telefone: '',
    endereco: '',
    numero: '',
    cep: ''
  });

  const [status, setStatus] = useState({ loading: false, error: '', success: '' });

  // Carregar dados do cliente ao abrir
  useEffect(() => {
    if (clienteId) {
      carregarPerfil();
    } else {
      // Se não estiver logado, redireciona para o login
      navigate('/login');
    }
  }, [clienteId]);

  const carregarPerfil = async () => {
    try {
      setStatus({ loading: true, error: '', success: '' });
      const response = await api.get(`/clientes/${clienteId}`);
      if (response.data) {
        setCliente(response.data);
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      setStatus({ loading: false, error: 'Não foi possível carregar os dados do perfil.', success: '' });
    } finally {
      setStatus(prev => ({ ...prev, loading: false }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCliente({ ...cliente, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: '', success: '' });

    try {
      await api.put(`/clientes/${clienteId}`, cliente);
      
      // Atualiza o nome armazenado no localStorage caso o usuário tenha alterado
      if (cliente.nome) {
        localStorage.setItem('clienteLogadoNome', cliente.nomePreferencia || cliente.nome);
      }

      setStatus({ 
        loading: false, 
        error: '', 
        success: 'Informações atualizadas com sucesso!' 
      });
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      const mensagemErro = error.response?.data?.message || 'Erro ao salvar alterações.';
      setStatus({ loading: false, error: mensagemErro, success: '' });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('clienteLogadoId');
    localStorage.removeItem('clienteLogadoNome');
    navigate('/');
  };

  
  const fecharPerfil = () => {
    if (onClose) {
      onClose();
    } else {
      navigate('/');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-neutral-900 border border-rose-500/30 rounded-2xl max-w-2xl w-full p-6 relative text-neutral-100 shadow-2xl my-8">
        
        {/* Botões do Topo (Fechar e Sair) */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <button 
            onClick={handleLogout}
            title="Sair da conta"
            className="flex items-center gap-1 px-3 py-1.5 text-xs bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-800 rounded-lg transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" /> Sair
          </button>
          
          <button 
            onClick={fecharPerfil} 
            className="text-neutral-400 hover:text-white cursor-pointer p-1.5 rounded-full bg-neutral-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cabeçalho */}
        <div className="mb-6 pb-4 border-b border-neutral-800 pr-24">
          <h2 className="text-2xl font-serif font-bold text-rose-300 flex items-center gap-2">
            <User className="w-6 h-6 text-rose-400" /> Informações do seu Perfil
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Você pode adicionar, alterar ou corrigir suas informações pessoais e os dados da conta.
          </p>
        </div>

        {/* Mensagens de Feedback */}
        {status.success && (
          <div className="mb-4 p-3 bg-green-950 border border-green-700 text-green-300 rounded-lg text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" /> {status.success}
          </div>
        )}
        {status.error && (
          <div className="mb-4 p-3 bg-red-950 border border-red-700 text-red-300 rounded-lg text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" /> {status.error}
          </div>
        )}

        {/* Formulário de Edição de Perfil */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nome Completo */}
            <div>
              <label className="block text-xs font-medium text-neutral-300 uppercase tracking-wider mb-1">
                Nome e Sobrenome
              </label>
              <input 
                type="text" 
                name="nome"
                value={cliente.nome || ''}
                onChange={handleChange}
                required
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-rose-500"
              />
            </div>

            {/* Nome de Preferência */}
            <div>
              <label className="block text-xs font-medium text-neutral-300 uppercase tracking-wider mb-1">
                Nome de Preferência
              </label>
              <input 
                type="text" 
                name="nomePreferencia"
                value={cliente.nomePreferencia || ''}
                onChange={handleChange}
                placeholder="Como gosta de ser chamado(a)"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* CPF */}
            <div>
              <label className="block text-xs font-medium text-neutral-300 uppercase tracking-wider mb-1 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-rose-400" /> Número do CPF
              </label>
              <input 
                type="text" 
                name="cpf"
                value={cliente.cpf || ''}
                onChange={handleChange}
                placeholder="000.000.000-00"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-rose-500"
              />
            </div>

            {/* Telefone */}
            <div>
              <label className="block text-xs font-medium text-neutral-300 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-rose-400" /> Telefone / WhatsApp
              </label>
              <input 
                type="text" 
                name="telefone"
                value={cliente.telefone || ''}
                onChange={handleChange}
                placeholder="(00) 00000-0000"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          {/* Endereço Fiscal */}
          <div className="bg-neutral-950/50 p-4 rounded-xl border border-neutral-800 space-y-3">
            <h3 className="text-xs font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-rose-400" /> Endereço Fiscal
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2">
                <label className="block text-[11px] text-neutral-400 uppercase mb-1">Logradouro / Rua</label>
                <input 
                  type="text" 
                  name="endereco"
                  value={cliente.endereco || ''}
                  onChange={handleChange}
                  placeholder="Ex: Av. Paulista"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-[11px] text-neutral-400 uppercase mb-1">Número</label>
                <input 
                  type="text" 
                  name="numero"
                  value={cliente.numero || ''}
                  onChange={handleChange}
                  placeholder="Ex: 1000"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-neutral-400 uppercase mb-1">CEP</label>
              <input 
                type="text" 
                name="cep"
                value={cliente.cep || ''}
                onChange={handleChange}
                placeholder="00000-000"
                className="w-full md:w-1/2 bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          {/* Dados da Conta */}
          <div className="bg-neutral-950/50 p-4 rounded-xl border border-neutral-800 space-y-3">
            <h3 className="text-xs font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-rose-400" /> Dados da Conta
            </h3>
            <div>
              <label className="block text-[11px] text-neutral-400 uppercase mb-1">E-mail de Acesso</label>
              <input 
                type="email" 
                name="email"
                value={cliente.email || ''}
                disabled
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-400 text-sm cursor-not-allowed"
              />
              <span className="text-[10px] text-neutral-500 mt-1 block">O e-mail principal não pode ser alterado diretamente por segurança.</span>
            </div>
          </div>

          {/* Botão Salvar */}
          <button 
            type="submit" 
            disabled={status.loading}
            className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-medium rounded-lg text-sm transition cursor-pointer mt-4 flex items-center justify-center gap-2"
          >
            {status.loading ? 'Salvando alterações...' : 'Salvar Alterações'}
          </button>
        </form>

      </div>
    </div>
  );
}