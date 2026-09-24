import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-black bg-gradient-to-r from-pink-500 via-purple-400 to-yellow-400 bg-clip-text text-transparent tracking-wider">
            MUNDO KIDS
          </span>
        </div>

        {/* Links Desktop */}
        <div className="hidden md:flex items-center space-x-8 text-sm font-semibold tracking-wide text-slate-300">
          <a href="#inicio" className="hover:text-pink-400 transition">Início</a>
          <a href="#sobre" className="hover:text-pink-400 transition">O Projeto</a>
          <a href="#lojas" className="hover:text-pink-400 transition">Para Lojas</a>
          <a href="#modelos" className="hover:text-pink-400 transition">Para Modelos</a>
          <a href="#beneficios" className="hover:text-pink-400 transition">Benefícios</a>
          <a href="#cronograma" className="hover:text-pink-400 transition">Cronograma</a>
          <a href="#local" className="hover:text-pink-400 transition">Local</a>
        </div>

        <div className="hidden md:block">
          <a 
            href="#inscricao" 
            className="bg-gradient-to-r from-pink-600 to-purple-600 px-5 py-2.5 rounded-full font-bold text-sm shadow-md text-white hover:opacity-90 transition transform hover:-translate-y-0.5"
          >
            Inscreva-se Já
          </a>
        </div>

        {/* Botão Menu Mobile */}
        <div className="md:hidden">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-300 hover:text-white focus:outline-none">
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Menu Dropdown Mobile */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-6 space-y-3">
          <a href="#inicio" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-300 hover:text-pink-400 font-medium">Início</a>
          <a href="#sobre" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-300 hover:text-pink-400 font-medium">O Projeto</a>
          <a href="#lojas" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-300 hover:text-pink-400 font-medium">Para Lojas</a>
          <a href="#modelos" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-300 hover:text-pink-400 font-medium">Para Modelos</a>
          <a href="#beneficios" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-300 hover:text-pink-400 font-medium">Benefícios</a>
          <a href="#cronograma" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-300 hover:text-pink-400 font-medium">Cronograma</a>
          <a href="#local" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-300 hover:text-pink-400 font-medium">Local</a>
          <a 
            href="#inscricao" 
            onClick={() => setMobileMenuOpen(false)} 
            className="block text-center w-full bg-gradient-to-r from-pink-600 to-purple-600 py-3 rounded-xl font-bold text-white mt-2"
          >
            Inscreva-se Já
          </a>
        </div>
      )}
    </nav>
  );
}