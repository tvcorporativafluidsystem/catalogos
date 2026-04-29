'use client';
import { useState } from 'react';
import CatalogoPage from './catalogo/page'; 

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

  if (view === 'HOME') {
    return (
      <main className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center p-4 relative font-sans overflow-hidden">
        <button 
          onClick={() => isAdmin ? alert('Admin Ativo') : setShowLoginModal(true)}
          className={`absolute top-6 md:top-8 right-4 md:right-8 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] border px-4 py-2 rounded-full z-50 ${
            isAdmin ? 'text-green-400 border-green-400/30' : 'text-white/30 border-white/10'
          }`}
        >
          {isAdmin ? '● Admin Ativo' : 'Acesso Administrativo'}
        </button>

        <div className="text-center mb-12 md:mb-20 z-10 mt-16 md:mt-0">
          <h1 className="text-white text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.85] mb-2">
            Catálogo <br className="md:hidden" /> de Produtos
          </h1>
          <p className="text-[#00A8CC] text-4xl md:text-6xl lg:text-7xl font-black italic tracking-widest leading-none">
            2026
          </p>
          
          {isAdmin && (
            <button 
              onClick={() => window.location.href = '/importar'} 
              className="mt-10 px-8 py-4 bg-green-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-green-600 transition-all shadow-2xl animate-bounce"
            >
              ⚙️ Abrir Painel de Controle
            </button>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-6 md:gap-10 max-w-6xl w-full justify-center items-center px-4 z-10">
          <div onClick={() => { setMarcaSelecionada('URBA'); setView('CATALOGO'); }} className="group cursor-pointer bg-slate-900/40 p-5 md:p-6 rounded-[2.5rem] md:rounded-[3rem] border-2 border-white/5 hover:border-[#00A8CC] transition-all duration-500 w-full max-w-[320px] md:max-w-sm shadow-2xl">
            <div className="bg-white rounded-[2rem] aspect-[2/1] flex items-center justify-center p-6 shadow-inner overflow-hidden">
              <img src="https://agygfdeizpfcdzxpukpx.supabase.co/storage/v1/object/public/catalog-images/logos/urba_logo.png" className="w-full h-full object-contain bg-white group-hover:scale-110 transition-transform duration-500" />
            </div>
            <p className="text-center text-white/20 text-[10px] font-bold uppercase tracking-[0.5em] mt-5 md:mt-6 group-hover:text-[#00A8CC] italic leading-none transition-colors">Entrar Urba</p>
          </div>

          <div onClick={() => { setMarcaSelecionada('BROSOL'); setView('CATALOGO'); }} className="group cursor-pointer bg-slate-900/40 p-5 md:p-6 rounded-[2.5rem] md:rounded-[3rem] border-2 border-white/5 hover:border-[#FFD700] transition-all duration-500 w-full max-w-[320px] md:max-w-sm shadow-2xl">
            <div className="bg-white rounded-[2rem] aspect-[2/1] flex items-center justify-center p-6 shadow-inner overflow-hidden">
              <img src="https://agygfdeizpfcdzxpukpx.supabase.co/storage/v1/object/public/catalog-images/logos/brosol_logo.png" className="w-full h-full object-contain bg-white group-hover:scale-110 transition-transform duration-500" />
            </div>
            <p className="text-center text-white/20 text-[10px] font-bold uppercase tracking-[0.5em] mt-5 md:mt-6 group-hover:text-[#FFD700] italic leading-none transition-colors">Entrar Brosol</p>
          </div>
        </div>

        {showLoginModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
            <div className="bg-[#1e293b] border border-white/10 p-10 rounded-[2.5rem] w-full max-w-md shadow-2xl text-slate-900">
              <h2 className="text-white font-black text-2xl mb-6 uppercase tracking-tighter">Autenticação</h2>
              <form onSubmit={handleLogin} className="space-y-4">
                <input name="user" required placeholder="Usuário" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:ring-2 focus:ring-[#00A8CC]" />
                <input name="pass" type="password" required placeholder="Senha" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:ring-2 focus:ring-[#00A8CC]" />
                <button type="submit" className="w-full bg-[#00A8CC] text-white font-black py-4 rounded-2xl hover:brightness-110 transition-all uppercase tracking-widest text-sm">Entrar</button>
                <button type="button" onClick={() => setShowLoginModal(false)} className="w-full text-white/30 text-[10px] font-black uppercase mt-4 text-center">Cancelar</button>
              </form>
            </div>
          </div>
        )}
      </main>
    );
  }

  return <CatalogoPage marcaInicial={marcaSelecionada} onBack={() => setView('HOME')} isAdmin={isAdmin} />;
}