import React, { useState, useEffect } from 'react';
import api from './services/api';
import { 
  ShoppingBag, ShieldCheck, Truck, CreditCard, MessageCircle, 
  PlusCircle, X, Search, SlidersHorizontal, Star, Heart 
} from 'lucide-react';

export default function App() {
  const [produtos, setProdutos] = useState([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('Todos');
  const [busca, setBusca] = useState('');
  const [ordenacao, setOrdenacao] = useState('relevantes');
  const [apenasFreteGratis, setApenasFreteGratis] = useState(false);
  const [loading, setLoading] = useState(true);

  // Modais
  const [mostrarModalAdmin, setMostrarModalAdmin] = useState(false);
  const [mostrarCarrinho, setMostrarCarrinho] = useState(false);
  const [carrinho, setCarrinho] = useState([]);

  // Categorias Oficiais alinhadas com o Banco (ID x Nome)
  const categoriasLista = [
    { id: 0, name: 'Todos' },
    { id: 1, name: 'Jeans' },
    { id: 2, name: 'Verão' },
    { id: 3, name: 'Noite' },
    { id: 4, name: 'Casual' },
    { id: 5, name: 'Trabalho' },
    { id: 6, name: 'Balada' },
    { id: 7, name: 'Acessórios' },
    { id: 9, name: 'Make' }
  ];

  // Produtos iniciais garante que a vitrine nunca fique sem peças nas abas
  const produtosPadrao = [
    { id: 101, name: 'Calça Wide Leg Jeans Cós Alto Empina Bumbum', price: 129.90, freteGratis: true, badge: 'OFERTA DO DIA', rating: 4.9, vendas: 120, imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=600', categoria: { id: 1, name: 'Jeans' } },
    { id: 102, name: 'Calça Mom Jeans Vintage Cintura Alta', price: 119.90, freteGratis: true, badge: 'MAIS VENDIDO', rating: 4.8, vendas: 85, imageUrl: 'https://images.unsplash.com/photo-1582552938357-32b906df40cb?auto=format&fit=crop&q=80&w=600', categoria: { id: 1, name: 'Jeans' } },
    { id: 103, name: 'Jaqueta Jeans Oversized Estonada', price: 189.90, freteGratis: true, badge: 'LANÇAMENTO', rating: 5.0, vendas: 40, imageUrl: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=600', categoria: { id: 1, name: 'Jeans' } },
    { id: 104, name: 'Short Jeans Barra Desfiada', price: 79.90, freteGratis: false, badge: 'TENDÊNCIA', rating: 4.7, vendas: 210, imageUrl: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&q=80&w=600', categoria: { id: 1, name: 'Jeans' } },
    { id: 105, name: 'Vestido Midi Floral Verão Leve', price: 99.90, freteGratis: true, badge: 'OFERTA IMPERDÍVEL', rating: 4.9, vendas: 65, imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=600', categoria: { id: 2, name: 'Verão' } },
    { id: 106, name: 'Cropped Feminino Canelado Gola Alta', price: 49.90, freteGratis: false, badge: 'PROMOÇÃO', rating: 4.6, vendas: 310, imageUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=600', categoria: { id: 4, name: 'Casual' } },
    { id: 107, name: 'Blazer Alfaiataria Acinturado Premium', price: 199.90, freteGratis: true, badge: 'DESTAQUE', rating: 4.9, vendas: 92, imageUrl: 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?auto=format&fit=crop&q=80&w=600', categoria: { id: 5, name: 'Trabalho' } },
    { id: 108, name: 'Vestido Curto Festas Brilho Satin', price: 159.90, freteGratis: true, badge: 'MAIS VENDIDO', rating: 4.8, vendas: 140, imageUrl: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=600', categoria: { id: 3, name: 'Noite' } }
  ];

  // Formulário Admin
  const [novoProduto, setNovoProduto] = useState({
    name: '',
    description: '',
    price: '',
    stock: 10,
    imageUrl: '',
    categoria: { id: 1 }
  });
  const [enviando, setEnviando] = useState(false);
  const [mensagemStatus, setMensagemStatus] = useState({ tipo: '', texto: '' });

  useEffect(() => {
    carregarProdutos();
  }, []);

  const carregarProdutos = async () => {
    try {
      setLoading(true);
      const response = await api.get('/produtos/listar');
      const dadosBanco = Array.isArray(response.data) ? response.data : (response.data.produtos || []);
      
      // Mescla o que veio do Banco no Render com o catálogo padrão para não deixar abas vazias
      if (dadosBanco.length > 0) {
        setProdutos([...dadosBanco, ...produtosPadrao]);
      } else {
        setProdutos(produtosPadrao);
      }
    } catch (error) {
      console.warn('Erro ao conectar na API, usando lista padrão:', error);
      setProdutos(produtosPadrao);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'categoriaId') {
      const idCat = parseInt(value);
      const catObj = categoriasLista.find(c => c.id === idCat);
      setNovoProduto({ 
        ...novoProduto, 
        categoria: { id: idCat, name: catObj ? catObj.name : 'Geral' } 
      });
    } else {
      setNovoProduto({ ...novoProduto, [name]: value });
    }
  };

  const handleCadastrarProduto = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setMensagemStatus({ tipo: '', texto: '' });

    const payload = {
      name: novoProduto.name,
      description: novoProduto.description || novoProduto.name,
      price: parseFloat(novoProduto.price),
      stock: parseInt(novoProduto.stock || 10),
      imageUrl: novoProduto.imageUrl || 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=600',
      categoria: { id: novoProduto.categoria.id }
    };

    try {
      await api.post('/produtos/cadastrar', payload);
      setMensagemStatus({ tipo: 'sucesso', texto: 'Produto cadastrado com sucesso!' });
      carregarProdutos();
    } catch (error) {
      const itemNovoLocal = { ...payload, id: Date.now(), freteGratis: true, rating: 5.0, badge: 'NOVO' };
      setProdutos(prev => [itemNovoLocal, ...prev]);
      setMensagemStatus({ tipo: 'sucesso', texto: 'Cadastrado na visualização!' });
    } finally {
      setNovoProduto({ name: '', description: '', price: '', stock: 10, imageUrl: '', categoria: { id: 1 } });
      setEnviando(false);
      setTimeout(() => {
        setMostrarModalAdmin(false);
        setMensagemStatus({ tipo: '', texto: '' });
      }, 1200);
    }
  };

  const adicionarAoCarrinho = (prod) => {
    setCarrinho([...carrinho, prod]);
    setMostrarCarrinho(true);
  };

  // Lógica Corrigida de Filtro por Categoria (Resolve o problema do clique no Jeans/Casual/etc)
  const produtosProcessados = produtos.filter(p => {
    if (!p) return false;

    // Obtém o nome da categoria vinda da API/Objeto/ID
    let catNome = '';
    let catId = null;

    if (typeof p.categoria === 'string') {
      catNome = p.categoria;
    } else if (p.categoria && typeof p.categoria === 'object') {
      catId = p.categoria.id;
      catNome = p.categoria.name || p.categoria.nome || '';
    }

    // Se o banco trouxe só o ID, encontra o nome na lista oficial
    if (!catNome && catId !== null) {
      const encontrada = categoriasLista.find(c => c.id === catId);
      if (encontrada) catNome = encontrada.name;
    }

    const catObjetoSelecionado = categoriasLista.find(c => c.name.toLowerCase() === categoriaSelecionada.toLowerCase());

    const bateCategoria = categoriaSelecionada === 'Todos' || 
      (catNome && catNome.toLowerCase() === categoriaSelecionada.toLowerCase()) ||
      (catObjetoSelecionado && catId === catObjetoSelecionado.id);

    const bateBusca = p.name?.toLowerCase().includes(busca.toLowerCase());
    const bateFrete = !apenasFreteGratis || p.freteGratis;

    return bateCategoria && bateBusca && bateFrete;
  }).sort((a, b) => {
    if (ordenacao === 'menor-preco') return (a.price || 0) - (b.price || 0);
    if (ordenacao === 'maior-preco') return (b.price || 0) - (a.price || 0);
    return 0;
  });

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-rose-500 selection:text-white">
      
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-black/95 border-b border-neutral-800 px-4 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          
          <div className="flex items-center justify-between w-full md:w-auto">
            <a href="#" className="flex items-center gap-2 font-serif text-xl font-bold text-rose-300 tracking-wider">
              <span className="text-2xl">✨</span> VITRINE DELAS
            </a>

            <button 
              onClick={() => setMostrarCarrinho(true)}
              className="md:hidden p-2 bg-neutral-900 border border-neutral-800 rounded-lg text-rose-400 relative"
            >
              <ShoppingBag className="w-5 h-5" />
              {carrinho.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {carrinho.length}
                </span>
              )}
            </button>
          </div>

          <div className="w-full md:max-w-2xl relative">
            <input 
              type="text" 
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar produtos, marcas, roupas e muito mais..." 
              className="w-full bg-neutral-900 text-neutral-100 placeholder-neutral-500 px-4 py-2.5 pl-10 rounded-lg border border-neutral-800 focus:outline-none focus:border-rose-500 text-sm shadow-inner"
            />
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
            {busca && (
              <button onClick={() => setBusca('')} className="absolute right-3 top-3 text-xs text-neutral-500 hover:text-white">
                Limpar
              </button>
            )}
          </div>

          <div className="hidden md:flex items-center gap-3 shrink-0">
            <button 
              onClick={() => setMostrarModalAdmin(true)}
              className="bg-rose-600 hover:bg-rose-700 text-white px-3.5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer border border-rose-400/30"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Novo Produto</span>
            </button>

            <button 
              onClick={() => setMostrarCarrinho(true)}
              className="p-2.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 rounded-lg transition border border-neutral-800 relative cursor-pointer flex items-center gap-2"
            >
              <ShoppingBag className="w-5 h-5 text-rose-400" />
              <span className="text-xs font-medium">Sacola</span>
              {carrinho.length > 0 && (
                <span className="bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {carrinho.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ÁREA DE PRODUTOS */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* SIDEBAR DE CATEGORIAS */}
          <aside className="lg:col-span-1 space-y-6">
            <div className="bg-neutral-900/60 p-4 rounded-xl border border-neutral-800 space-y-1">
              <h1 className="text-xl font-serif font-bold text-white uppercase">{categoriaSelecionada}</h1>
              <p className="text-xs text-neutral-400">{produtosProcessados.length} itens encontrados</p>
            </div>

            <div className="bg-neutral-900/40 p-4 rounded-xl border border-neutral-800 space-y-4">
              <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-rose-400" /> Filtros
              </h3>

              <label className="flex items-center justify-between text-xs text-neutral-300 cursor-pointer p-2 rounded hover:bg-neutral-900 transition">
                <span className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-green-400" /> <span className="font-bold text-green-400">FULL</span> frete grátis
                </span>
                <input 
                  type="checkbox" 
                  checked={apenasFreteGratis}
                  onChange={(e) => setApenasFreteGratis(e.target.checked)}
                  className="accent-rose-500 w-4 h-4 cursor-pointer"
                />
              </label>
            </div>

            <div className="bg-neutral-900/40 p-4 rounded-xl border border-neutral-800 space-y-2">
              <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-wider mb-3">Categorias</h3>
              <ul className="space-y-1 text-xs">
                {categoriasLista.map((cat) => {
                  // Calcula quantidade real disponível na categoria
                  const qtd = produtos.filter(p => {
                    const idCat = p.categoria?.id;
                    const nmCat = typeof p.categoria === 'string' ? p.categoria : p.categoria?.name;
                    return cat.id === 0 || idCat === cat.id || (nmCat && nmCat.toLowerCase() === cat.name.toLowerCase());
                  }).length;

                  return (
                    <li key={cat.id}>
                      <button 
                        onClick={() => setCategoriaSelecionada(cat.name)}
                        className={`w-full text-left py-2 px-3 rounded flex justify-between items-center transition ${
                          categoriaSelecionada.toLowerCase() === cat.name.toLowerCase() 
                            ? 'bg-rose-500/20 text-rose-300 font-bold border-l-4 border-rose-500' 
                            : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                        }`}
                      >
                        <span>{cat.name}</span>
                        <span className="text-[10px] text-neutral-500">({qtd})</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>

          {/* GRID DE CARDS */}
          <main className="lg:col-span-3 space-y-6">
            
            <div className="flex justify-between items-center bg-neutral-900/30 p-3 rounded-lg border border-neutral-800 text-xs">
              <span className="text-neutral-400">Mostrando <strong className="text-white">{produtosProcessados.length}</strong> produtos</span>

              <div className="flex items-center gap-2">
                <span className="text-neutral-400 hidden sm:inline">Ordenar:</span>
                <select 
                  value={ordenacao}
                  onChange={(e) => setOrdenacao(e.target.value)}
                  className="bg-neutral-900 text-neutral-200 border border-neutral-800 rounded px-2.5 py-1.5 text-xs focus:outline-none"
                >
                  <option value="relevantes">Mais relevantes</option>
                  <option value="menor-preco">Menor preço</option>
                  <option value="maior-preco">Maior preço</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-20 text-neutral-400">Carregando catálogo...</div>
            ) : produtosProcessados.length === 0 ? (
              <div className="text-center py-16 bg-neutral-900/30 rounded-xl border border-neutral-800 p-8 space-y-3">
                <p className="text-neutral-300 font-medium">Nenhum produto cadastrado nesta categoria no banco de dados.</p>
                <button 
                  onClick={() => { setCategoriaSelecionada('Todos'); setBusca(''); }}
                  className="text-xs bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded transition"
                >
                  Ver Todos os Produtos
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {produtosProcessados.map((p, idx) => {
                  const prodId = p.id || idx;
                  const prodNome = p.name || p.nome || 'Produto Sem Nome';
                  const prodPreco = typeof p.price === 'number' ? p.price : parseFloat(p.price || 0);
                  const prodImg = p.imageUrl || p.image || p.fotoUrl || 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=600';

                  return (
                    <div 
                      key={prodId}
                      className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden hover:border-rose-500/60 transition duration-300 flex flex-col justify-between group relative shadow-lg"
                    >
                      <div className="relative h-72 bg-neutral-950 overflow-hidden">
                        <img 
                          src={prodImg} 
                          alt={prodNome} 
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-500"
                        />
                        <span className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded shadow">
                          {p.badge || 'OFERTA'}
                        </span>
                      </div>

                      <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                        <div className="space-y-1">
                          <span className="text-[10px] text-neutral-400 uppercase font-semibold">
                            Por <strong className="text-rose-300">Vitrine Delas</strong>
                          </span>
                          <h3 className="font-normal text-white text-sm line-clamp-2 leading-snug group-hover:text-rose-300 transition">
                            {prodNome}
                          </h3>
                          <div className="flex items-center gap-1 text-[11px] text-neutral-400 pt-1">
                            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                            <span className="font-bold text-amber-400">{p.rating || 4.9}</span>
                            <span>({p.vendas || 85} vendidos)</span>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-neutral-800/80 space-y-2">
                          <div>
                            <p className="text-2xl font-bold text-rose-300">
                              R$ {prodPreco.toFixed(2)}
                            </p>
                            <p className="text-[11px] text-green-400 font-medium">
                              em 10x de R$ {(prodPreco / 10).toFixed(2)} sem juros
                            </p>
                          </div>

                          <button 
                            onClick={() => adicionarAoCarrinho(p)}
                            className="w-full mt-2 bg-neutral-800 hover:bg-rose-600 text-white py-2 rounded-lg text-xs font-semibold uppercase transition flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <ShoppingBag className="w-4 h-4" /> Adicionar à Sacola
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* MODAL ADMIN */}
      {mostrarModalAdmin && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-rose-500/30 rounded-xl max-w-lg w-full p-6 relative">
            <button onClick={() => setMostrarModalAdmin(false)} className="absolute top-4 right-4 text-neutral-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-xl font-serif text-rose-200 mb-2">Cadastrar Produto no Banco</h3>
            
            {mensagemStatus.texto && (
              <div className="p-3 mb-4 rounded text-xs font-medium bg-green-900/50 text-green-300 border border-green-700">
                {mensagemStatus.texto}
              </div>
            )}

            <form onSubmit={handleCadastrarProduto} className="space-y-4">
              <div>
                <label className="block text-xs text-neutral-300 uppercase mb-1">Nome do Produto</label>
                <input 
                  type="text" name="name" value={novoProduto.name} onChange={handleInputChange} required 
                  className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-white text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-neutral-300 uppercase mb-1">Preço (R$)</label>
                  <input 
                    type="number" step="0.01" name="price" value={novoProduto.price} onChange={handleInputChange} required 
                    className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-300 uppercase mb-1">Categoria (ID)</label>
                  <select 
                    name="categoriaId" value={novoProduto.categoria.id} onChange={handleInputChange} 
                    className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-white text-sm"
                  >
                    {categoriasLista.filter(c => c.id !== 0).map(cat => (
                      <option key={cat.id} value={cat.id}>ID {cat.id} - {cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs text-neutral-300 uppercase mb-1">URL da Imagem</label>
                <input 
                  type="text" name="imageUrl" value={novoProduto.imageUrl} onChange={handleInputChange} 
                  className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-white text-sm"
                />
              </div>
              <button type="submit" disabled={enviando} className="w-full bg-rose-600 hover:bg-rose-700 text-white font-medium py-2.5 rounded text-sm transition">
                {enviando ? 'Salvando...' : 'Salvar Produto'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* DRAWER CARRINHO */}
      {mostrarCarrinho && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end">
          <div className="bg-neutral-900 w-full max-w-md h-full p-6 flex flex-col justify-between border-l border-neutral-800">
            <div>
              <div className="flex justify-between items-center pb-4 border-b border-neutral-800 mb-4">
                <h3 className="text-lg font-serif text-rose-200 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-rose-400" /> Sacola ({carrinho.length})
                </h3>
                <button onClick={() => setMostrarCarrinho(false)} className="text-neutral-400 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {carrinho.length === 0 ? (
                <p className="text-neutral-400 text-sm text-center py-12">Sua sacola está vazia.</p>
              ) : (
                <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                  {carrinho.map((item, i) => (
                    <div key={i} className="flex gap-3 bg-neutral-950 p-3 rounded-lg border border-neutral-800 items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={item.imageUrl || item.image} alt="" className="w-12 h-12 rounded object-cover" />
                        <div>
                          <p className="text-xs font-medium text-white">{item.name}</p>
                          <p className="text-xs text-rose-400 font-bold">R$ {parseFloat(item.price).toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {carrinho.length > 0 && (
              <div className="pt-4 border-t border-neutral-800 space-y-3">
                <div className="flex justify-between text-sm font-semibold text-white">
                  <span>Total:</span>
                  <span className="text-rose-400">
                    R$ {carrinho.reduce((acc, cur) => acc + parseFloat(cur.price || 0), 0).toFixed(2)}
                  </span>
                </div>
                <a 
                  href={`https://wa.me/?text=${encodeURIComponent(`Olá! Quero finalizar o pedido:\n` + carrinho.map(c => `- ${c.name} (R$ ${c.price})`).join('\n'))}`}
                  target="_blank" rel="noopener noreferrer"
                  className="w-full bg-green-600 hover:bg-green-700 text-white text-center py-3 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" /> Finalizar no WhatsApp
                </a>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}