'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-4">
      <h1 className="text-4xl font-black mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-400 uppercase tracking-tighter">
        Sistema de Catálogos Urba & Brosol
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        <Link href="/catalogo" className="p-8 bg-slate-800 rounded-3xl border border-slate-700 hover:border-blue-500 transition-all text-center group shadow-2xl">
          <div className="text-4xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold mb-2 group-hover:text-blue-400 text-white">Visualizar Catálogo</h2>
          <p className="text-slate-400 text-sm">Pesquise produtos, aplique filtros e veja fotos técnicas.</p>
        </Link>

        <Link href="/importar" className="p-8 bg-slate-800 rounded-3xl border border-slate-700 hover:border-green-500 transition-all text-center group shadow-2xl">
          <div className="text-4xl mb-4">⚙️</div>
          <h2 className="text-2xl font-bold mb-2 group-hover:text-green-400 text-white">Painel de Controle</h2>
          <p className="text-slate-400 text-sm">Upload de planilhas Excel e galeria de fotos do Storage.</p>
        </Link>
      </div>
      
      <footer className="mt-12 text-slate-500 text-xs font-bold tracking-widest uppercase">
        Desenvolvido para Urba Brosol
      </footer>
    </div>
  );
}