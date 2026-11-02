import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Send, ShieldCheck, Truck, Mail, Phone, Code2, Globe } from 'lucide-react';

export default function Footer() {
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    alert('Obrigado por se inscrever! Em breve você receberá ofertas exclusivas no seu e-mail.');
  };

  return (
    <footer className="bg-black text-neutral-400 border-t border-neutral-800 pt-12 pb-6 px-4 md:px-8 font-sans mt-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        
        {/* Coluna 1: Sobre & Newsletter */}
        <div className="space-y-4">
          <h3 className="text-white text-base font-serif font-bold uppercase tracking-wider flex items-center gap-2">
            <span className="text-rose-400">✨</span> Fique por dentro
          </h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Cadastre-se na <strong>Vitrine Delas</strong> para receber novidades, lançamentos e cupons de desconto exclusivos em primeira mão.
          </p>
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-2">
            <input 
              type="email" 
              required
              placeholder="Seu melhor e-mail" 
              className="bg-neutral-900 border border-neutral-800 text-white px-3.5 py-2 rounded-lg focus:outline-none focus:border-rose-500 text-xs shadow-inner" 
            />
            <button 
              type="submit" 
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold uppercase py-2 rounded-lg transition text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <Send className="w-3.5 h-3.5" /> Inscrever-se
            </button>
          </form>
        </div>

        {/* Coluna 2: Atendimento */}
        <div>
          <h3 className="text-white text-xs font-bold uppercase tracking-wider mb-4 border-l-2 border-rose-500 pl-2">
            Atendimento
          </h3>
          <ul className="space-y-2.5 text-xs">
            <li>
              <a 
                href="https://wa.me/5511987052920" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-rose-300 transition flex items-center gap-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5 text-green-400" /> WhatsApp Suporte
              </a>
            </li>
            <li><Link to="/sacola" className="hover:text-rose-300 transition">Meus Pedidos</Link></li>
            <li><a href="#" className="hover:text-rose-300 transition">Trocas e Devoluções</a></li>
            <li><a href="#" className="hover:text-rose-300 transition">Prazos e Entregas</a></li>
            <li><a href="#" className="hover:text-rose-300 transition">Central de Ajuda (FAQ)</a></li>
          </ul>
        </div>

        {/* Coluna 3: Institucional */}
        <div>
          <h3 className="text-white text-xs font-bold uppercase tracking-wider mb-4 border-l-2 border-rose-500 pl-2">
            Institucional
          </h3>
          <ul className="space-y-2.5 text-xs">
            <li><a href="#" className="hover:text-rose-300 transition">Sobre a Marca</a></li>
            <li><Link to="/admin" className="hover:text-rose-300 transition text-rose-400 font-semibold">Painel Administrativo</Link></li>
            <li><a href="#" className="hover:text-rose-300 transition">Política de Privacidade</a></li>
            <li><a href="#" className="hover:text-rose-300 transition">Termos de Uso</a></li>
          </ul>
        </div>

        {/* Coluna 4: Pagamento & Redes */}
        <div>
          <h3 className="text-white text-xs font-bold uppercase tracking-wider mb-4 border-l-2 border-rose-500 pl-2">
            Formas de Pagamento
          </h3>
          <div className="flex flex-wrap gap-2 text-[10px] font-bold uppercase mb-6 text-neutral-300">
            <span className="bg-neutral-900 px-2.5 py-1 border border-neutral-800 rounded text-green-400">PIX</span>
            <span className="bg-neutral-900 px-2.5 py-1 border border-neutral-800 rounded">Cartão de Crédito</span>
            <span className="bg-neutral-900 px-2.5 py-1 border border-neutral-800 rounded">Mercado Pago</span>
          </div>

          <h3 className="text-white text-xs font-bold uppercase tracking-wider mb-3 border-l-2 border-rose-500 pl-2">
            Redes Sociais
          </h3>
          <div className="flex flex-col gap-2 text-xs">
            <a 
              href="https://instagram.com/masfgroove" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2 bg-neutral-900 border border-neutral-800 rounded-lg hover:text-rose-400 hover:border-rose-500/40 transition flex items-center gap-2"
            >
              <Globe className="w-4 h-4 text-rose-400" /> @masfgroove (Instagram)
            </a>
          </div>
        </div>

      </div>

      {/* Copyright e Assinatura do Desenvolvedor */}
      <div className="border-t border-neutral-900 pt-6 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-[11px] text-neutral-500 gap-4">
        <p>© 2026 Vitrine Delas. Todos os direitos reservados.</p>
        
        {/* Sua Propaganda / Assinatura */}
        <div className="flex flex-wrap items-center justify-center gap-3 bg-neutral-900/60 px-4 py-2 rounded-lg border border-neutral-800/80 text-neutral-300">
          <span className="flex items-center gap-1.5 font-medium text-white">
            <Code2 className="w-4 h-4 text-rose-400" /> Desenvolvido por:
          </span>
          <span className="font-bold text-rose-300">Marco Antonio da Silva Ferreira</span>
          <span className="text-neutral-600">|</span>
          <a href="https://wa.me/5511987052920" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition flex items-center gap-1">
            <Phone className="w-3 h-3" /> (11) 98705-2920
          </a>
          <span className="text-neutral-600">|</span>
          <a href="mailto:masfgroove2012@gmail.com" className="hover:text-rose-400 transition flex items-center gap-1">
            <Mail className="w-3 h-3" /> masfgroove2012@gmail.com
          </a>
        </div>
      </div>
    </footer>
  );
}