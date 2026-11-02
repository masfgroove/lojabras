import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from './services/api';
import { ShoppingBag, ArrowLeft, CheckCircle2, ShieldCheck, CreditCard, QrCode } from 'lucide-react';

export default function Sacola() {
  const navigate = useNavigate();
  const [carrinho, setCarrinho] = useState([]);
  const [enviando, setEnviando] = useState(false);
  
  // Estado do formulário de endereço do cliente
  const [endereco, setEndereco] = useState({
    cep: '',
    rua: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: ''
  });

  // Controla as etapas: 'carrinho' -> 'endereco' -> 'pagamento'
  const [etapa, setEtapa] = useState('carrinho');

  useEffect(() => {
    // Carrega os itens salvos na sacola
    const carrinhoSalvo = JSON.parse(localStorage.getItem('carrinho_vitrine')) || [];
    setCarrinho(carrinhoSalvo);
  }, []);

  const subtotal = carrinho.reduce((acc, cur) => acc + parseFloat(cur.preco || cur.price || 0), 0);
  const frete = subtotal > 0 ? 15.00 : 0;
  const total = subtotal + frete;

  const handleInputChange = (e) => {
    setEndereco({ ...endereco, [e.target.name]: e.target.value });
  };

  const removerItem = (indexParaRemover) => {
    const novoCarrinho = carrinho.filter((_, index) => index !== indexParaRemover);
    setCarrinho(novoCarrinho);
    localStorage.setItem('carrinho_vitrine', JSON.stringify(novoCarrinho));
  };

  // Função para finalizar e salvar o pedido no backend Spring Boot / Supabase
  const handleFinalizarPedido = async () => {
    try {
      setEnviando(true);

      // Pega o ID do cliente logado (se não houver, assume o ID 1 por padrão para testes)
      const clienteIdLogado = localStorage.getItem('clienteLogadoId') || 1;

      const payload = {
        clienteId: parseInt(clienteIdLogado),
        valorTotal: total,
        enderecoEntrega: {
          cep: endereco.cep,
          rua: endereco.rua,
          numero: endereco.numero,
          bairro: endereco.bairro,
          cidade: endereco.cidade,
          estado: endereco.estado
        },
        itensPedido: carrinho.map(item => ({
          produtoId: item.id || 1,
          quantidade: item.quantidade || 1,
          preco: parseFloat(item.preco || item.price || 0)
        }))
      };

      const response = await api.post('/pedidos', payload);

      if (response.data.status === 'sucesso' || response.status === 200) {
        alert('Pedido e endereço gravados com sucesso no banco de dados!');
        localStorage.removeItem('carrinho_vitrine'); // Limpa a sacola
        navigate('/'); // Retorna ao catálogo ou para uma tela de sucesso
      } else {
        alert('Erro ao gravar pedido: ' + (response.data.mensagem || 'Erro desconhecido'));
      }
    } catch (error) {
      console.error('Erro ao enviar pedido para o backend:', error);
      alert('Falha ao conectar com o servidor Spring Boot. Verifique se ele está ativo.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-4 lg:p-8 font-sans selection:bg-rose-500 selection:text-white">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Cabeçalho */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <Link to="/" className="flex items-center gap-2 text-rose-400 hover:text-rose-300 text-sm font-semibold transition">
            <ArrowLeft className="w-4 h-4" /> Voltar ao catálogo
          </Link>
          <h1 className="text-xl font-serif text-white font-bold tracking-wider">✨ VITRINE DELAS</h1>
        </div>

        {carrinho.length === 0 ? (
          <div className="text-center py-20 bg-neutral-900/40 rounded-xl border border-neutral-800 space-y-4">
            <ShoppingBag className="w-16 h-16 text-neutral-600 mx-auto" />
            <h2 className="text-lg font-medium text-neutral-300">Sua sacola está vazia</h2>
            <Link to="/" className="inline-block bg-rose-600 hover:bg-rose-700 text-white px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition">
              Ver Produtos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Lado Esquerdo: Etapas da Compra */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* ETAPA 1: ITENS DA SACOLA */}
              {etapa === 'carrinho' && (
                <div className="bg-neutral-900/60 p-6 rounded-xl border border-neutral-800 space-y-4">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-rose-300 border-b border-neutral-800 pb-2">
                    1. Produtos Selecionados ({carrinho.length})
                  </h2>
                  
                  {carrinho.map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-center justify-between bg-neutral-950 p-4 rounded-lg border border-neutral-800">
                      <div className="flex items-center gap-4">
                        <img src={item.urlImg || item.imageUrl || item.image} alt="" className="w-16 h-16 object-cover rounded border border-neutral-800" />
                        <div>
                          <p className="text-sm font-bold text-white">{item.titulo || item.name}</p>
                          <p className="text-xs text-neutral-400">Tam: {item.tamanhoEscolhido || 'Único'} | Cor: {item.corEscolhida || 'Padrão'}</p>
                          <p className="text-sm text-rose-400 font-bold mt-1">R$ {parseFloat(item.preco || item.price).toFixed(2)}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => removerItem(idx)}
                        className="text-xs text-red-400 hover:text-red-300 font-medium underline cursor-pointer">
                        Remover
                      </button>
                    </div>
                  ))}

                  <button 
                    onClick={() => setEtapa('endereco')}
                    className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3.5 rounded-lg text-xs uppercase tracking-wider transition mt-4 cursor-pointer shadow-lg shadow-rose-900/20">
                    Continuar para Endereço de Entrega
                  </button>
                </div>
              )}

              {/* ETAPA 2: ENDEREÇO DE ENTREGA */}
              {etapa === 'endereco' && (
                <div className="bg-neutral-900/60 p-6 rounded-xl border border-neutral-800 space-y-4">
                  <div className="flex justify-between items-center border-b border-neutral-800 pb-2">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-rose-300">2. Endereço de Entrega</h2>
                    <button onClick={() => setEtapa('carrinho')} className="text-xs text-neutral-400 hover:text-white underline">
                      Alterar produtos
                    </button>
                  </div>

                  <form className="space-y-3">
                    <div>
                      <label className="block text-[11px] text-neutral-400 uppercase mb-1">CEP</label>
                      <input type="text" name="cep" placeholder="Ex: 01001-000" value={endereco.cep} onChange={handleInputChange} className="w-full bg-neutral-950 border border-neutral-800 rounded p-2.5 text-sm text-white focus:outline-none focus:border-rose-500" />
                    </div>

                    <div>
                      <label className="block text-[11px] text-neutral-400 uppercase mb-1">Rua / Avenida</label>
                      <input type="text" name="rua" placeholder="Rua Exemplo" value={endereco.rua} onChange={handleInputChange} className="w-full bg-neutral-950 border border-neutral-800 rounded p-2.5 text-sm text-white focus:outline-none focus:border-rose-500" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-neutral-400 uppercase mb-1">Número</label>
                        <input type="text" name="numero" placeholder="123" value={endereco.numero} onChange={handleInputChange} className="w-full bg-neutral-950 border border-neutral-800 rounded p-2.5 text-sm text-white focus:outline-none focus:border-rose-500" />
                      </div>
                      <div>
                        <label className="block text-[11px] text-neutral-400 uppercase mb-1">Bairro</label>
                        <input type="text" name="bairro" placeholder="Centro" value={endereco.bairro} onChange={handleInputChange} className="w-full bg-neutral-950 border border-neutral-800 rounded p-2.5 text-sm text-white focus:outline-none focus:border-rose-500" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-neutral-400 uppercase mb-1">Cidade</label>
                        <input type="text" name="cidade" placeholder="São Paulo" value={endereco.cidade} onChange={handleInputChange} className="w-full bg-neutral-950 border border-neutral-800 rounded p-2.5 text-sm text-white focus:outline-none focus:border-rose-500" />
                      </div>
                      <div>
                        <label className="block text-[11px] text-neutral-400 uppercase mb-1">Estado (UF)</label>
                        <input type="text" name="estado" placeholder="SP" value={endereco.estado} onChange={handleInputChange} className="w-full bg-neutral-950 border border-neutral-800 rounded p-2.5 text-sm text-white focus:outline-none focus:border-rose-500" />
                      </div>
                    </div>
                  </form>

                  <button 
                    onClick={() => setEtapa('pagamento')}
                    className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3.5 rounded-lg text-xs uppercase tracking-wider transition mt-4 cursor-pointer shadow-lg shadow-rose-900/20">
                    Ir para o Pagamento (Pix)
                  </button>
                </div>
              )}

              {/* ETAPA 3: PAGAMENTO PIX & GRAVAÇÃO NO BANCO */}
              {etapa === 'pagamento' && (
                <div className="bg-neutral-900/60 p-6 rounded-xl border border-neutral-800 space-y-4 text-center">
                  <div className="flex justify-between items-center border-b border-neutral-800 pb-2 text-left">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-rose-300">3. Pagamento via Pix</h2>
                    <button onClick={() => setEtapa('endereco')} className="text-xs text-neutral-400 hover:text-white underline">
                      Alterar Endereço
                    </button>
                  </div>

                  <div className="p-6 bg-neutral-950 rounded-lg border border-neutral-800 space-y-4">
                    <div className="flex justify-center text-rose-400">
                      <QrCode className="w-12 h-12" />
                    </div>
                    <p className="text-xs text-neutral-300">Escaneie o código QR ou clique no botão abaixo para concluir o pedido:</p>
                    
                    <div className="p-4 bg-neutral-900 rounded border border-neutral-800">
                      <p className="text-xs text-neutral-400">Valor Total a Pagar:</p>
                      <p className="text-2xl font-bold text-green-400">R$ {total.toFixed(2)}</p>
                    </div>

                    <button 
                      onClick={handleFinalizarPedido} 
                      disabled={enviando}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-lg text-xs uppercase tracking-wider transition cursor-pointer shadow-lg shadow-green-900/30 disabled:opacity-50">
                      {enviando ? 'Gravando Pedido no Banco...' : 'Confirmar Pagamento e Finalizar'}
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* Lado Direito: Resumo Fixo (Estilo Mercado Livre) */}
            <div className="bg-neutral-900/60 p-6 rounded-xl border border-neutral-800 h-fit space-y-4 sticky top-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-neutral-800 pb-2">
                Resumo da compra
              </h3>
              
              <div className="space-y-3 text-xs text-neutral-300">
                <div className="flex justify-between">
                  <span>Produtos ({carrinho.length})</span>
                  <span>R$ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Envio / Frete</span>
                  <span className="text-green-400 font-semibold">{frete > 0 ? `R$ ${frete.toFixed(2)}` : 'Grátis'}</span>
                </div>
                <div className="border-t border-neutral-800 pt-3 flex justify-between text-base font-bold text-white">
                  <span>Total</span>
                  <span className="text-rose-400">R$ {total.toFixed(2)}</span>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-neutral-400 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-green-400" /> Compra 100% Segura
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}