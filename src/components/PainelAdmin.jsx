import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { LayoutDashboard, ShoppingBag, Package, Users, ArrowLeft, CheckCircle, Clock, AlertCircle } from 'lucide-react';



export default function PainelAdmin() {
  const navigate = useNavigate();
  const [abaAtiva, setAbaAtiva] = useState('vendas');
  
  const [pedidos, setPedidos] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [carregando, setCarregando] = useState(false);

  // Carrega os dados ao abrir o painel
  useEffect(() => {
    carregarDadosAdmin();
  }, [abaAtiva]);

  const carregarDadosAdmin = async () => {
    try {
      setCarregando(true);
      if (abaAtiva === 'vendas') {
        // Rota do back-end para listar pedidos (ajuste se necessário para /pedidos)
        const res = await api.get('/pedidos');
        setPedidos(res.data || []);
      } else if (abaAtiva === 'estoque') {
        const res = await api.get('/produtos');
        setProdutos(res.data || []);
      } else if (abaAtiva === 'clientes') {
        const res = await api.get('/clientes');
        setClientes(res.data || []);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do painel:', error);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex font-sans selection:bg-rose-500 selection:text-white">
      
      {/* Sidebar de Navegação */}
      <aside className="w-64 bg-neutral-900 border-r border-neutral-800 p-6 flex flex-col justify-between hidden md:flex">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6 text-rose-400" />
            <h1 className="text-base font-serif font-bold tracking-wider text-white">PAINEL ADMIN</h1>
          </div>

          <nav className="space-y-2">
            <button 
              onClick={() => setAbaAtiva('vendas')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition ${abaAtiva === 'vendas' ? 'bg-rose-600 text-white' : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'}`}>
              <ShoppingBag className="w-4 h-4" /> Vendas / Pedidos
            </button>

            <button 
              onClick={() => setAbaAtiva('estoque')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition ${abaAtiva === 'estoque' ? 'bg-rose-600 text-white' : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'}`}>
              <Package className="w-4 h-4" /> Estoque & Produtos
            </button>

            <button 
              onClick={() => setAbaAtiva('clientes')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition ${abaAtiva === 'clientes' ? 'bg-rose-600 text-white' : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'}`}>
              <Users className="w-4 h-4" /> Clientes
            </button>
          </nav>
        </div>

        <div>
          <Link to="/" className="flex items-center gap-2 text-xs text-neutral-400 hover:text-rose-400 transition">
            <ArrowLeft className="w-4 h-4" /> Voltar à Loja
          </Link>
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto space-y-6">
        
        {/* Cabeçalho do Painel */}
        <div className="flex justify-between items-center pb-4 border-b border-neutral-800">
          <h2 className="text-xl font-bold uppercase tracking-wider text-white">
            {abaAtiva === 'vendas' && 'Gerenciamento de Vendas e Pagamentos'}
            {abaAtiva === 'estoque' && 'Controle de Estoque e Produtos'}
            {abaAtiva === 'clientes' && 'Base de Clientes Cadastrados'}
          </h2>
          <span className="text-xs text-neutral-400 bg-neutral-900 px-3 py-1.5 rounded border border-neutral-800">
            Ambiente Administrativo
          </span>
        </div>

        {carregando ? (
          <div className="text-center py-20 text-neutral-400 text-sm">Carregando dados...</div>
        ) : (
          <div>
            
            {/* ABA 1: VENDAS E PAGAMENTOS */}
            {abaAtiva === 'vendas' && (
              <div className="bg-neutral-900/60 rounded-xl border border-neutral-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-neutral-900 text-neutral-400 uppercase border-b border-neutral-800">
                      <tr>
                        <th className="p-4">ID Pedido</th>
                        <th className="p-4">Cliente ID</th>
                        <th className="p-4">Valor Total</th>
                        <th className="p-4">Status Pagamento</th>
                        <th className="p-4">Endereço de Entrega</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800">
                      {pedidos.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="p-6 text-center text-neutral-500">Nenhum pedido registrado ainda.</td>
                        </tr>
                      ) : (
                        pedidos.map((pedido) => (
                          <tr key={pedido.id} className="hover:bg-neutral-900/40 transition">
                            <td className="p-4 font-bold text-white">#{pedido.id}</td>
                            <td className="p-4 text-neutral-300">{pedido.clienteId || '1'}</td>
                            <td className="p-4 text-rose-400 font-bold">R$ {parseFloat(pedido.valorTotal || 0).toFixed(2)}</td>
                            <td className="p-4">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                                pedido.statusPagamento === 'APROVADO' || pedido.statusPagamento === 'PAGO'
                                  ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                  : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                              }`}>
                                {pedido.statusPagamento === 'APROVADO' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                {pedido.statusPagamento || 'PENDENTE'}
                              </span>
                            </td>
                            <td className="p-4 text-neutral-400 max-w-xs truncate">
                              {pedido.enderecoEntrega ? `${pedido.enderecoEntrega.rua}, ${pedido.enderecoEntrega.numero} - ${pedido.enderecoEntrega.cidade}` : 'Endereço padrão'}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ABA 2: ESTOQUE E PRODUTOS */}
            {abaAtiva === 'estoque' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {produtos.map((prod) => (
                  <div key={prod.id} className="bg-neutral-900/60 p-4 rounded-xl border border-neutral-800 flex gap-4 items-center">
                    <img src={prod.urlImg || prod.imageUrl || prod.image} alt="" className="w-16 h-16 object-cover rounded border border-neutral-800" />
                    <div>
                      <h3 className="text-sm font-bold text-white">{prod.titulo || prod.name}</h3>
                      <p className="text-xs text-rose-400 font-semibold mt-0.5">R$ {parseFloat(prod.preco || prod.price || 0).toFixed(2)}</p>
                      <p className="text-[11px] text-neutral-400 mt-1">Estoque disp.: <span className="text-white font-bold">{prod.estoque || 10}</span></p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ABA 3: CLIENTES */}
            {abaAtiva === 'clientes' && (
              <div className="bg-neutral-900/60 rounded-xl border border-neutral-800 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-900 text-neutral-400 uppercase border-b border-neutral-800">
                    <tr>
                      <th className="p-4">ID</th>
                      <th className="p-4">Nome</th>
                      <th className="p-4">E-mail</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800">
                    {clientes.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="p-6 text-center text-neutral-500">Nenhum cliente listado.</td>
                      </tr>
                    ) : (
                      clientes.map((cli) => (
                        <tr key={cli.id} className="hover:bg-neutral-900/40 transition">
                          <td className="p-4 font-bold text-white">#{cli.id}</td>
                          <td className="p-4 text-neutral-200">{cli.nome}</td>
                          <td className="p-4 text-neutral-400">{cli.email}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

          </div>
        )}
      </main>
    </div>
  );
}