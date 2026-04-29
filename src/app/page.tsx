'use client';
import { useState } from 'react';
// Importe aqui o seu componente de catálogo ou mantenha a lógica de navegação
import CatalogoPage from './catalogo/page'; // Ajuste o caminho conforme sua estrutura

export default function Home() {
  const [view, setView] = useState<'HOME' | 'CATALOGO'>('HOME');
  const [marcaSelecionada, setMarcaSelecionada] = useState<'URBA' | 'BROSOL'>('URBA');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (formData.get('user') === 'admin' && formData.get('pass') === 'admin123') {
      setIsAdmin(true);
      setShowLoginModal(false);
    } else {
      alert('Usuário ou senha incorretos');
    }
  };

  // --- TELA DE CAPA (AGORA COMO DEFAULT) ---
  if (view === 'HOME') {
    return (
      <main className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center p-4 relative font-sans">
        <button 
          onClick={() => isAdmin ? alert('Admin ativo') : setShowLoginModal(true)}
          className="absolute top-8 right-8 text-white/40 text-[10px] font-black uppercase tracking-[0.2em] border border-white/10 px-4 py-2 rounded-full"
        >
          {isAdmin ? '● Admin Ativo' : 'Acesso Restrito'}
        </button>

        <div className="text-center mb-16">
          <h1 className="text-white text-4xl lg:text-7xl font-black uppercase tracking-tighter mb-4">Catálogo de Produtos</h1>
          <p className="text-[#00A8CC] text-3xl lg:text-5xl font-black italic tracking-widest">2026</p>
        </div>

        <div className="flex flex-col md:flex-row gap-10 w-full max-w-6xl justify-center items-center">
          <div onClick={() => { setMarcaSelecionada('URBA'); setView('CATALOGO'); }} className="group cursor-pointer bg-slate-900/50 p-6 rounded-[3rem] border-2 border-white/5 hover:border-[#00A8CC] transition-all w-full max-w-sm">
            <div className="bg-white rounded-[2rem] aspect-[2/1] flex items-center justify-center p-6">
              <img src="https://agygfdeizpfcdzxpukpx.supabase.co/storage/v1/object/public/catalog-images/logos/urba_logo.png" className="w-full h-full object-contain" />
            </div>
            <p className="text-center text-white/20 text-[10px] font-bold uppercase mt-6 group-hover:text-[#00A8CC]">Entrar Urba</p>
          </div>

          <div onClick={() => { setMarcaSelecionada('BROSOL'); setView('CATALOGO'); }} className="group cursor-pointer bg-slate-900/50 p-6 rounded-[3rem] border-2 border-white/5 hover:border-[#FFD700] transition-all w-full max-w-sm">
            <div className="bg-white rounded-[2rem] aspect-[2/1] flex items-center justify-center p-6">
              <img src="https://agygfdeizpfcdzxpukpx.supabase.co/storage/v1/object/public/catalog-images/logos/brosol_logo.png" className="w-full h-full object-contain" />
            </div>
            <p className="text-center text-white/20 text-[10px] font-bold uppercase mt-6 group-hover:text-[#FFD700]">Entrar Brosol</p>
          </div>
        </div>

        {showLoginModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md">
            <div className="bg-[#1e293b] p-10 rounded-[2.5rem] w-full max-w-md border border-white/10">
              <h2 className="text-white font-black text-2xl mb-6">LOGIN ADMIN</h2>
              <form onSubmit={handleLogin} className="space-y-4">
                <input name="user" placeholder="Usuário" className="w-full bg-white/5 p-4 rounded-2xl text-white outline-none border border-white/10" />
                <input name="pass" type="password" placeholder="Senha" className="w-full bg-white/5 p-4 rounded-2xl text-white outline-none border border-white/10" />
                <button type="submit" className="w-full bg-[#00A8CC] text-white font-black py-4 rounded-2xl">ENTRAR</button>
                <button type="button" onClick={() => setShowLoginModal(false)} className="w-full text-white/30 text-xs mt-4">VOLTAR</button>
              </form>
            </div>
          </div>
        )}
      </main>
    );
  }

  // Aqui você chama o componente do catálogo que já tem os filtros
  return <CatalogoPage marcaInicial={marcaSelecionada} onBack={() => setView('HOME')} isAdmin={isAdmin} />;
}