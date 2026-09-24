import React, { useState, useEffect } from 'react';
import api from './services/api';
import { ShoppingBag, ShieldCheck, Truck, CreditCard, MessageCircle, PlusCircle, X } from 'lucide-react';

export default function App() {
  const [produtos, setProdutos] = useState([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('Todos');
  const [loading, setLoading] = useState(true);
  const [mostrarModalAdmin, setMostrarModalAdmin] = useState(false);

  // Estados do formulário de cadastro de novo produto
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

  // Categorias oficiais da Vitrine Delas
  const categorias = ['Todos', 'Jeans', 'Verão', 'Noite', 'Casual', 'Trabalho', 'Balada', 'Festa', 'Acessórios', 'Make', 'Promoções'];

  const looksInspiracao = [
    { id: 1, titulo: 'LOOK JEANS', descricao: 'Calça + Cropped + Bolsa + Tênis', categoria: 'Jeans' },
    { id: 2, titulo: 'LOOK VERÃO', descricao: 'Vestido Floral + Rasteira + Bolsa + Óculos', categoria: 'Verão' },
    { id: 3, titulo: 'LOOK NOITE', descricao: 'Vestido de Brilho + Salto + Clutch + Acessórios', categoria: 'Noite' },
    { id: 4, titulo: 'LOOK TRABALHO', descricao: 'Blazer + Calça + Camisa + Bolsa + Scarpin', categoria: 'Trabalho' },
    { id: 5, titulo: 'LOOK BALADA', descricao: 'Cropped + Calça + Salto + Bolsa + Acessórios', categoria: 'Balada' },
  ];

  useEffect(() => {
    carregarProdutos();
  }, []);

  const carregarProdutos = async () => {
    try {
      setLoading(true);
      const response = await api.get('/produtos/listar');
      const dados = Array.isArray(response.data) ? response.data : (response.data.produtos || []);
      setProdutos(dados);
    } catch (error) {
      console.error('Erro ao buscar produtos do backend:', error);
      setProdutos([
        { id: 1, name: 'Cropped Canelado', price: 39.90, categoria: { name: 'Make' }, imageUrl: '' },
        { id: 2, name: 'Calça Wide Leg', price: 99.90, categoria: { name: 'Jeans' }, imageUrl: '' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'categoriaId') {
      setNovoProduto({ ...novoProduto, categoria: { id: parseInt(value) } });
    } else {
      setNovoProduto({ ...novoProduto, [name]: value });
    }
  };

  const handleCadastrarProduto = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setMensagemStatus({ tipo: '', texto: '' });

    try {
      const payload = {
        name: novoProduto.name,
        description: novoProduto.description || novoProduto.name,
        price: parseFloat(novoProduto.price),
        stock: parseInt(novoProduto.stock || 10),
        imageUrl: novoProduto.imageUrl,
        categoria: novoProduto.categoria
      };

      await api.post('/produtos/cadastrar', payload);

      setMensagemStatus({
        tipo: 'sucesso',
        texto: 'Produto cadastrado com sucesso no banco de dados!'
      });

      setNovoProduto({ name: '', description: '', price: '', stock: 10, imageUrl: '', categoria: { id: 1 } });
      carregarProdutos();
      
      setTimeout(() => {
        setMostrarModalAdmin(false);
        setMensagemStatus({ tipo: '', texto: '' });
      }, 1500);

    } catch (error) {
      console.error('Erro ao cadastrar produto:', error);
      setMensagemStatus({
        tipo: 'erro',
        texto: 'Falha ao cadastrar. Verifique os dados e a base de dados.'
      });
    } finally {
      setEnviando(false);
    }
  };

  const produtosFiltrados = produtos.filter(p => {
    if (!p) return false;
    const catProduto = typeof p.categoria === 'string' ? p.categoria : (p.categoria?.name || p.categoria?.nome || 'Geral');
    if (categoriaSelecionada === 'Todos') return true;
    return catProduto.toLowerCase() === categoriaSelecionada.toLowerCase();
  });

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans relative">
      
      {/* BOTÃO FLUTUANTE DE ACESSO AO PAINEL ADMIN */}
      <button 
        onClick={() => setMostrarModalAdmin(true)}
        className="fixed bottom-6 right-6 z-50 bg-rose-600 hover:bg-rose-700 text-white p-4 rounded-full shadow-2xl flex items-center gap-2 transition cursor-pointer border border-rose-400/30"
        title="Painel Administrativo - Cadastrar Produto"
      >
        <PlusCircle className="w-6 h-6" />
        <span className="text-xs font-semibold uppercase tracking-wider hidden md:inline">Novo Produto</span>
      </button>

      {/* MODAL / PAINEL ADMINISTRATIVO */}
      {mostrarModalAdmin && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-rose-500/30 rounded-xl max-w-lg w-full p-6 shadow-2xl relative">
            <button 
              onClick={() => setMostrarModalAdmin(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-xl font-serif text-rose-200 mb-2">Painel Admin - Cadastrar Produto</h3>
            <p className="text-xs text-neutral-400 mb-6">Insira os dados do produto para gravá-lo diretamente na base de dados do Spring Boot.</p>

            {mensagemStatus.texto && (
              <div className={`p-3 mb-4 rounded text-xs font-medium ${
                mensagemStatus.tipo === 'sucesso' ? 'bg-green-900/50 text-green-300 border border-green-700' : 'bg-red-900/50 text-red-300 border border-red-700'
              }`}>
                {mensagemStatus.texto}
              </div>
            )}

            <form onSubmit={handleCadastrarProduto} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 uppercase tracking-wider mb-1">Nome do Produto</label>
                <input 
                  type="text" 
                  name="name"
                  value={novoProduto.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Ex: Cropped Seda Premium" 
                  className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 uppercase tracking-wider mb-1">Descrição</label>
                <input 
                  type="text" 
                  name="description"
                  value={novoProduto.description}
                  onChange={handleInputChange}
                  placeholder="Descrição detalhada do produto" 
                  className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 uppercase tracking-wider mb-1">Preço (R$)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    name="price"
                    value={novoProduto.price}
                    onChange={handleInputChange}
                    required
                    placeholder="79.90" 
                    className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 uppercase tracking-wider mb-1">ID da Categoria</label>
                  <input 
                    type="number" 
                    name="categoriaId"
                    value={novoProduto.categoria.id}
                    onChange={handleInputChange}
                    required
                    placeholder="1" 
                    className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 uppercase tracking-wider mb-1">URL da Imagem (Opcional)</label>
                <input 
                  type="text" 
                  name="imageUrl"
                  value={novoProduto.imageUrl}
                  onChange={handleInputChange}
                  placeholder="https://exemplo.com/foto.jpg" 
                  className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-rose-500"
                />
              </div>

              <button 
                type="submit" 
                disabled={enviando}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-medium py-2.5 rounded text-sm transition cursor-pointer mt-4"
              >
                {enviando ? 'A salvar no Backend...' : 'Salvar Produto'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TOPO / HEADER */}
      <header className="border-b border-neutral-800 bg-black py-8 px-4 text-center">
        <div className="flex justify-center items-center mb-2">
          <img 
            src="/logo.png" 
            alt="Vitrine Delas Logo" 
            className="h-40 md:h-52 w-auto object-contain mx-auto"
          />
        </div>
        <p className="text-xs md:text-sm text-rose-300/80 italic mt-2">Seu estilo, suas escolhas, sua melhor versão. ♥</p>
      </header>

      {/* BARRA DE CATEGORIAS */}
      <nav className="bg-neutral-900 border-b border-neutral-800 py-3 px-4 overflow-x-auto sticky top-0 z-40 shadow-md">
        <div className="flex justify-start md:justify-center gap-6 min-w-max text-sm uppercase tracking-wider text-neutral-300">
          {categorias.map((cat, idx) => (
            <button 
              key={idx} 
              onClick={() => setCategoriaSelecionada(cat)}
              className={`transition cursor-pointer pb-1 ${
                categoriaSelecionada === cat 
                  ? 'text-rose-400 border-b-2 border-rose-500 font-semibold' 
                  : 'hover:text-rose-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </nav>

      {/* BANNER HERO */}
      <section className="relative bg-gradient-to-r from-neutral-900 to-rose-950/40 py-16 px-6 text-center border-b border-neutral-800">
        <div className="max-w-3xl mx-auto space-y-4">
          <span className="bg-rose-500/20 text-rose-300 text-xs px-3 py-1 rounded-full uppercase tracking-widest border border-rose-500/30">
            Nova Coleção Ame-Se ♥
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white">
            Tendências e Novidades para Looks que Arrasam!
          </h2>
          <p className="text-neutral-300 text-sm md:text-base">
            Moda feminina para todos os momentos. Do casual ao sofisticado, do básico ao tendência.
          </p>
          <div className="pt-4 flex justify-center gap-4">
            <button className="bg-rose-600 hover:bg-rose-700 text-white px-8 py-3 rounded-md font-medium tracking-wide shadow-lg transition cursor-pointer">
              Comprar Agora
            </button>
            <a 
              href="https://wa.me/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 border border-rose-500/50 hover:bg-rose-500/10 text-rose-200 px-6 py-3 rounded-md font-medium transition"
            >
              <MessageCircle className="w-5 h-5 text-green-400" /> Chamar no WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* BENEFÍCIOS */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-black border-b border-neutral-800 text-xs md:text-sm text-center">
        <div className="flex flex-col items-center gap-1 p-2">
          <Truck className="text-rose-400 w-5 h-5" />
          <span className="font-semibold">Envio Rápido</span>
          <span className="text-neutral-400 text-xs">Para todo Brasil</span>
        </div>
        <div className="flex flex-col items-center gap-1 p-2">
          <CreditCard className="text-rose-400 w-5 h-5" />
          <span className="font-semibold">Até 6x Sem Juros</span>
          <span className="text-neutral-400 text-xs">No cartão de crédito</span>
        </div>
        <div className="flex flex-col items-center gap-1 p-2">
          <ShieldCheck className="text-rose-400 w-5 h-5" />
          <span className="font-semibold">Compra Segura</span>
          <span className="text-neutral-400 text-xs">Seus dados protegidos</span>
        </div>
        <div className="flex flex-col items-center gap-1 p-2">
          <ShoppingBag className="text-rose-400 w-5 h-5" />
          <span className="font-semibold">Troca Fácil</span>
          <span className="text-neutral-400 text-xs">Sem burocracia</span>
        </div>
      </section>

{/* VITRINE DE PRODUTOS */}
      <main className="max-w-7xl mx-auto py-12 px-4">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-serif text-rose-200 border-l-4 border-rose-500 pl-3">
            {categoriaSelecionada === 'Todos' ? 'Achadinhos Delas ♥' : `Categoria: ${categoriaSelecionada}`}
          </h3>
          <span className="text-xs text-neutral-400 uppercase tracking-widest">Atualizado Semanalmente</span>
        </div>

        {loading ? (
          <div className="text-center py-20 text-neutral-400">A carregar produtos da base de dados...</div>
        ) : produtosFiltrados.length === 0 ? (
          <div className="text-center py-20 text-neutral-400">Nenhum produto encontrado nesta categoria.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {produtosFiltrados.map((p, idx) => {
              const prodId = p.id || p.codigo || idx;
              const prodNome = p.name || p.nome || 'Produto Sem Nome';
              const prodPreco = typeof p.price === 'number' ? p.price : (typeof p.preco === 'number' ? p.preco : parseFloat(p.price || p.preco || 0));
              const prodCat = typeof p.categoria === 'string' ? p.categoria : (p.categoria?.name || p.categoria?.nome || 'Moda');
              const prodImg = p.imageUrl || p.image || p.imagemUrl || '';

              return (
                <div key={prodId} className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden group hover:border-rose-500/50 transition">
                  <div className="h-64 bg-neutral-800 flex items-center justify-center text-neutral-500 group-hover:bg-neutral-700/50 transition">
                    {prodImg ? (
                      <img src={prodImg} alt={prodNome} className="w-full h-full object-cover object-center" />
                    ) : (
                      <span className="text-xs text-neutral-500">[ Foto do Produto ]</span>
                    )}
                  </div>
                  <div className="p-4 space-y-2">
                    <span className="text-xs text-rose-400 uppercase tracking-wider">{prodCat}</span>
                    <h4 className="font-medium text-white">{prodNome}</h4>
                    <p className="text-lg font-bold text-rose-300">
                      R$ {prodPreco.toFixed(2)}
                    </p>
                    <button className="w-full mt-2 bg-neutral-800 hover:bg-rose-600 text-white py-2 rounded text-sm transition cursor-pointer">
                      Adicionar à Sacola
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* LOOKS PARA INSPIRAR */}
      <section className="bg-black py-16 px-4 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs text-rose-400 tracking-widest uppercase">Editorial de Moda</span>
            <h3 className="text-3xl font-serif text-rose-200 mt-1">Looks para Inspirar ♥</h3>
            <p className="text-neutral-400 text-sm mt-2">Combinações perfeitas escolhidas para cada momento do seu dia.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {looksInspiracao.map((look) => (
              <div key={look.id} className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden group hover:border-rose-500 transition flex flex-col justify-between">
                <div className="h-72 bg-neutral-800 flex items-center justify-center text-neutral-500 group-hover:bg-neutral-700 transition">
                  <span className="text-xs text-neutral-400 px-2 text-center">[ Foto {look.titulo} ]</span>
                </div>
                <div className="p-4 space-y-2">
                  <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded uppercase tracking-wider">
                    {look.categoria}
                  </span>
                  <h4 className="font-serif text-base text-white">{look.titulo}</h4>
                  <p className="text-xs text-neutral-400">{look.descricao}</p>
                  <button 
                    onClick={() => setCategoriaSelecionada(look.categoria)}
                    className="w-full mt-3 bg-neutral-800 hover:bg-rose-600 text-white py-1.5 rounded text-xs transition cursor-pointer"
                  >
                    Ver Peças do Look
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RODAPÉ */}
      <footer className="bg-black border-t border-neutral-800 py-10 px-4 text-center text-neutral-400 text-sm">
        <p className="font-serif text-rose-200 text-lg mb-2">VITRINE DELAS</p>
        <p className="text-xs text-neutral-500 mb-4">Mais que moda, é sobre se sentir bem todos os dias! ♥</p>
        
        <div className="flex justify-center items-center gap-2 mb-6">
          <a 
            href="https://instagram.com/vitrinedelas.oficial" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-rose-300 hover:text-rose-400 transition tracking-wider flex items-center gap-1.5"
          >
            📸 @vitrinedelas.oficial
          </a>
        </div>

        <p className="text-xs text-neutral-600">www.vitridelas.com.br — Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}