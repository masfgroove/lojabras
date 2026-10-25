import React, { useState } from 'react';
import api from '../services/api'; // Ajuste o caminho se necessário (ex: './services/api')

export default function InclusaoProduto({ onProdutoCadastrado }) {
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    preco: '',
    quantidadeEstoque: 10,
    categoria: { id: 1 }
  });

  const [status, setStatus] = useState({ loading: false, error: '', success: '' });

  // Lista de categorias oficiais do LojaBrás
  const categoriasLista = [
    { id: 1, name: 'Jeans' },
    { id: 2, name: 'Verão' },
    { id: 3, name: 'Noite' },
    { id: 4, name: 'Casual' },
    { id: 5, name: 'Trabalho' },
    { id: 6, name: 'Balada' },
    { id: 7, name: 'Festa' },
    { id: 8, name: 'Acessórios' },
    { id: 9, name: 'Make' },
    { id: 10, name: 'Promoções' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'categoriaId') {
      setFormData({ ...formData, categoria: { id: parseInt(value) } });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: '', success: '' });

    try {
      const payload = {
        titulo: formData.titulo,
        descricao: formData.descricao || formData.titulo,
        preco: parseFloat(formData.preco),
        quantidadeEstoque: parseInt(formData.quantidadeEstoque || 10),
        categoria: formData.categoria
      };

      // Envia para a rota POST /produtos do backend LojaBrás no Render
      await api.post('/produtos', payload);
      
      setStatus({ 
        loading: false, 
        error: '', 
        success: 'Produto incluído com sucesso no banco de dados!' 
      });
      
      setFormData({
        titulo: '',
        descricao: '',
        preco: '',
        quantidadeEstoque: 10,
        categoria: { id: 1 }
      });

      // Se houver uma função callback para atualizar a lista, chama ela
      if (onProdutoCadastrado) {
        onProdutoCadastrado();
      }

    } catch (err) {
      console.error('Erro na inclusão do produto:', err);
      const mensagemErro = err.response?.data?.message || err.message || 'Erro ao conectar com a API';
      setStatus({ 
        loading: false, 
        error: `Erro ao salvar produto: ${mensagemErro}`, 
        success: '' 
      });
    }
  };

  return (
    <section id="inclusao-produto" className="py-12 px-4 bg-neutral-950 text-neutral-100">
      <div className="max-w-md mx-auto bg-neutral-900 border border-rose-500/30 rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-rose-600 to-rose-800 p-6 text-center text-white">
          <h2 className="text-2xl font-serif font-bold">INCLUIR NOVO PRODUTO</h2>
          <p className="text-xs text-rose-100 mt-1">Adicione novas peças diretamente na Vitrine Delas ♥</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {status.success && (
            <div className="p-3 bg-green-950 border border-green-700 text-green-300 rounded text-xs text-center font-medium">
              {status.success}
            </div>
          )}
          {status.error && (
            <div className="p-3 bg-red-950 border border-red-700 text-red-300 rounded text-xs text-center font-medium">
              {status.error}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-neutral-300 uppercase tracking-wider mb-1">Título do Produto *</label>
            <input 
              type="text" 
              name="titulo" 
              value={formData.titulo} 
              onChange={handleChange} 
              required 
              className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded text-white text-sm focus:outline-none focus:border-rose-500" 
              placeholder="Ex: Cropped Seda Premium" 
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 uppercase tracking-wider mb-1">Descrição</label>
            <input 
              type="text" 
              name="descricao" 
              value={formData.descricao} 
              onChange={handleChange} 
              className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded text-white text-sm focus:outline-none focus:border-rose-500" 
              placeholder="Detalhes da peça..." 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-300 uppercase tracking-wider mb-1">Preço (R$) *</label>
              <input 
                type="number" 
                step="0.01" 
                name="preco" 
                value={formData.preco} 
                onChange={handleChange} 
                required 
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded text-white text-sm focus:outline-none focus:border-rose-500" 
                placeholder="79.90" 
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 uppercase tracking-wider mb-1">Categoria *</label>
              <select 
                name="categoriaId" 
                value={formData.categoria.id} 
                onChange={handleChange} 
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded text-white text-sm focus:outline-none focus:border-rose-500"
              >
                {categoriasLista.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.id} - {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={status.loading} 
            className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-medium rounded text-sm transition cursor-pointer mt-4"
          >
            {status.loading ? 'Salvando no Banco...' : 'Salvar Produto'}
          </button>
        </form>
      </div>
    </section>
  );
}