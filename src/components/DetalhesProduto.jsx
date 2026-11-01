import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { 
  ShoppingBag, ShieldCheck, Truck, ArrowLeft, Star, 
  Check, RefreshCw 
} from 'lucide-react';

export default function DetalhesProduto() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tamanhoSelecionado, setTamanhoSelecionado] = useState('');
  const [corSelecionada, setCorSelecionada] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [imagemPrincipal, setImagemPrincipal] = useState('');
  const [adicionadoComSucesso, setAdicionadoComSucesso] = useState(false);

  useEffect(() => {
    if (id) {
      carregarDetalhesProduto();
    }
  }, [id]);

  const carregarDetalhesProduto = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/produtos/${id}`);
      if (response && response.data) {
        setProduto(response.data);
        setImagemPrincipal(response.data.urlImg || response.data.imageUrl || 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=600');
        
        if (response.data.coresDisponiveis) {
          const cores = response.data.coresDisponiveis.split(',');
          if (cores.length > 0) setCorSelecionada(cores[0].trim());
        } else {
          setCorSelecionada('Padrão');
        }

        if (response.data.tamanhosDisponiveis) {
          const tamanhos = response.data.tamanhosDisponiveis.split(',');
          if (tamanhos.length > 0) setTamanhoSelecionado(tamanhos[0].trim());
        } else {
          setTamanhoSelecionado('Único');
        }
      }
    } catch (error) {
      console.error('Erro ao carregar detalhes do produto:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdicionarAoCarrinho = () => {
    if (!produto) return;

    const carrinhoAtual = JSON.parse(localStorage.getItem('carrinho_vitrine')) || [];
    
    const itemCarrinho = {
      ...produto,
      tamanhoEscolhido: tamanhoSelecionado || 'Único',
      corEscolhida: corSelecionada || 'Padrão',
      quantidadeSelecionada: quantidade
    };

    carrinhoAtual.push(itemCarrinho);
    localStorage.setItem('carrinho_vitrine', JSON.stringify(carrinhoAtual));

    setAdicionadoComSucesso(true);
    setTimeout(() => setAdicionadoComSucesso(false), 2500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-rose-500"></div>
      </div>
    );
  }

  if (!produto) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-center gap-4">
        <p className="text-neutral-400">Produto não encontrado.</p>
        <button onClick={() => navigate('/')} className="bg-rose-600 text-white px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer">
          Voltar para a Vitrine
        </button>
      </div>
    );
  }

  const listaTamanhos = produto.tamanhosDisponiveis ? produto.tamanhosDisponiveis.split(',').map(t => t.trim()) : ['P', 'M', 'G', 'GG'];
  const listaCores = produto.coresDisponiveis ? produto.coresDisponiveis.split(',').map(c => c.trim()) : ['Azul Jeans', 'Preto'];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans pb-16">
      
      {/* HEADER */}
      <header className="bg-black/95 border-b border-neutral-800 px-4 lg:px-8 py-3 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="text-neutral-400 hover:text-white flex items-center gap-1.5 text-xs font-medium cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-rose-400" /> Voltar ao catálogo
          </button>
          
          <Link to="/" className="font-serif text-xl font-bold text-rose-300 tracking-wider">
            ✨ VITRINE DELAS
          </Link>

          <div className="w-20"></div>
        </div>
      </header>

      {/* CONTEÚDO */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 lg:p-8">
          
          {/* FOTOS */}
          <div className="lg:col-span-7 flex flex-col md:flex-row gap-4">
            <div className="flex md:flex-col gap-2 overflow-x-auto">
              <button 
                onClick={() => setImagemPrincipal(produto.urlImg || produto.imageUrl)}
                className={`w-16 h-16 rounded-lg border-2 overflow-hidden bg-neutral-950 shrink-0 cursor-pointer ${imagemPrincipal === (produto.urlImg || produto.imageUrl) ? 'border-rose-500' : 'border-neutral-800'}`}
              >
                <img src={produto.urlImg || produto.imageUrl} alt="" className="w-full h-full object-cover" />
              </button>
            </div>

            <div className="flex-1 bg-neutral-950 rounded-xl overflow-hidden border border-neutral-800 relative h-[450px] flex items-center justify-center">
              <span className="absolute top-4 left-4 bg-blue-600 text-white text-[11px] font-bold uppercase px-2.5 py-1 rounded shadow">
                {produto.badge || 'NOVIDADE'}
              </span>
              <img 
                src={imagemPrincipal || produto.urlImg || produto.imageUrl} 
                alt={produto.titulo} 
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>

          {/* DETALHES E COMPRA */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="space-y-2">
              <span className="text-xs text-neutral-400">Novo | +100 vendidos</span>
              <h1 className="text-xl lg:text-2xl font-normal text-white leading-snug">
                {produto.titulo}
              </h1>

              <div className="flex items-center gap-1 text-amber-400 text-xs">
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <span className="text-neutral-400 ml-2">(328)</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-3xl lg:text-4xl font-bold text-rose-300">
                R$ {parseFloat(produto.preco || 0).toFixed(2)}
              </div>
              <p className="text-xs text-neutral-400">em até 10x sem juros no cartão</p>
            </div>

            {/* Cor */}
            <div className="space-y-2 pt-2 border-t border-neutral-800">
              <span className="text-xs font-semibold text-neutral-300 uppercase">
                Cor: <strong className="text-white">{corSelecionada}</strong>
              </span>
              <div className="flex gap-2">
                {listaCores.map((cor, i) => (
                  <button
                    key={i}
                    onClick={() => setCorSelecionada(cor)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
                      corSelecionada === cor 
                        ? 'border-rose-500 bg-rose-500/20 text-rose-300 font-bold' 
                        : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-600'
                    }`}
                  >
                    {cor}
                  </button>
                ))}
              </div>
            </div>

            {/* Tamanho */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-semibold text-neutral-300 uppercase">
                Tamanho: <strong className="text-white">{tamanhoSelecionado}</strong>
              </span>
              <div className="flex flex-wrap gap-2">
                {listaTamanhos.map((tam, i) => (
                  <button
                    key={i}
                    onClick={() => setTamanhoSelecionado(tam)}
                    className={`w-12 h-12 rounded-xl text-xs font-bold border transition flex items-center justify-center cursor-pointer ${
                      tamanhoSelecionado === tam 
                        ? 'border-rose-500 bg-rose-500/20 text-rose-300 shadow' 
                        : 'border-neutral-800 bg-neutral-950 text-neutral-300 hover:border-neutral-600'
                    }`}
                  >
                    {tam}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2 text-xs text-neutral-300 bg-neutral-950 p-3.5 rounded-xl border border-neutral-800">
              <div className="flex items-center gap-2 text-green-400 font-bold">
                <Truck className="w-4 h-4" /> Frete Grátis <span className="bg-green-500/20 px-1.5 py-0.5 rounded text-[10px]">FULL</span>
              </div>
              <p className="text-neutral-400">Estoque disponível: <strong className="text-white">{produto.quantidadeEstoque || 10} unidades</strong></p>
            </div>

            {adicionadoComSucesso && (
              <div className="p-3 bg-green-950 border border-green-700 text-green-300 rounded-lg text-xs flex items-center gap-2">
                <Check className="w-4 h-4" /> Produto adicionado com sucesso à sacola!
              </div>
            )}

            <div className="space-y-3 pt-4 border-t border-neutral-800">
              <button 
                onClick={handleAdicionarAoCarrinho}
                className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition cursor-pointer shadow-lg flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" /> Adicionar à Sacola
              </button>
            </div>

            <div className="pt-2 space-y-2 text-xs text-neutral-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-rose-400 shrink-0" />
                <span><strong>Compra Garantida</strong>, receba o produto que está esperando ou devolvemos o dinheiro.</span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-rose-400 shrink-0" />
                <span><strong>Devolução grátis</strong>. Você tem 30 dias a partir da data de recebimento.</span>
              </div>
            </div>

          </div>

        </div>

        {/* DESCRIÇÃO */}
        <div className="mt-8 bg-neutral-900 border border-neutral-800 rounded-2xl p-6 lg:p-8 space-y-4">
          <h3 className="text-lg font-serif font-bold text-rose-200">Descrição do Produto</h3>
          <p className="text-sm text-neutral-300 leading-relaxed whitespace-pre-line">
            {produto.descricao || 'Produto de altíssima qualidade, fabricado com tecidos premium selecionados para garantir conforto e elegância.'}
          </p>
        </div>
      </main>
    </div>
  );
}