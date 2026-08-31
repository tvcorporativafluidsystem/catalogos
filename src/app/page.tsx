'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CatalogoPage from './catalogo/page';

// --- DICIONÁRIO DE TRADUÇÕES ---
const translations = {
  PT: {
    title: "Catálogo de Produtos",
    admin: "Acesso Administrativo",
    adminActive: "● Admin Ativo (Sair)",
    enter: "Entrar",
    loginTitle: "Autenticação",
    userPlaceholder: "Usuário",
    passPlaceholder: "Senha",
    loginBtn: "Entrar",
    cancelBtn: "Cancelar"
  },
  ES: {
    title: "Catálogo de Productos",
    admin: "Acceso Administrativo",
    adminActive: "● Admin Activo (Salir)",
    enter: "Enter",
    loginTitle: "Autenticación",
    userPlaceholder: "Usuario",
    passPlaceholder: "Contraseña",
    loginBtn: "Entrar",
    cancelBtn: "Cancelar"
  },
  EN: {
    title: "Product Catalog",
    admin: "Administrative Access",
    adminActive: "● Admin Active (Logout)",
    enter: "Enter",
    loginTitle: "Authentication",
    userPlaceholder: "Username",
    passPlaceholder: "Password",
    loginBtn: "Login",
    cancelBtn: "Cancel"
  }
};

export default function Home() {
  const router = useRouter();
  const [lang, setLang] = useState<'PT' | 'ES' | 'EN'>('PT');
  const [view, setView] = useState<'HOME' | 'CATALOGO'>('HOME');
  const [marcaSelecionada, setMarcaSelecionada] = useState<'URBA' | 'BROSOL'>('URBA');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const t = translations[lang];

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (formData.get('user') === 'admin' && formData.get('pass') === 'admin123') {
      setIsAdmin(true);
      setShowLoginModal(false);
    } else {
      alert(lang === 'PT' ? 'Usuário ou senha incorretos' : 'Incorrect credentials');
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    alert(lang === 'PT' ? 'Sessão administrativa encerrada.' : 'Session ended.');
  };

  if (view === 'HOME') {
    return (
      <main className="min-h-screen bg-[#0f172a] flex flex-col justify-between items-center p-6 font-sans overflow-hidden text-white leading-none relative">
        
        {/* Cabeçalho superior flexível (Línguas + Admin) */}
        <header className="w-full max-w-7xl flex items-center justify-between z-50">
          <div className="flex gap-4">
            <button 
              onClick={() => setLang('PT')} 
              className={`text-2xl transition-all hover:scale-125 ${lang === 'PT' ? 'opacity-100' : 'opacity-30 grayscale'}`}
              title="Português"
            >
              🇧🇷
            </button>
            <button 
              onClick={() => setLang('ES')} 
              className={`text-2xl transition-all hover:scale-125 ${lang === 'ES' ? 'opacity-100' : 'opacity-30 grayscale'}`}
              title="Español"
            >
              🇪🇸
            </button>
            <button 
              onClick={() => setLang('EN')} 
              className={`text-2xl transition-all hover:scale-125 ${lang === 'EN' ? 'opacity-100' : 'opacity-30 grayscale'}`}
              title="English"
            >
              🇺🇸
            </button>
          </div>

          <button 
            onClick={() => isAdmin ? handleLogout() : setShowLoginModal(true)}
            className={`text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] border px-4 py-2 rounded-full transition-all ${
              isAdmin ? 'text-green-400 border-green-400/30 bg-green-400/5' : 'text-white/30 border-white/10 bg-white/5'
            } hover:bg-white/10 active:scale-95 leading-none font-sans`}
          >
            {isAdmin ? t.adminActive : t.admin}
          </button>
        </header>

        {/* Conteúdo Central */}
        <div className="flex-1 flex flex-col items-center justify-center w-full my-8 z-10">
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-white text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-tight mb-3 font-sans">
              {t.title}
            </h1>
            <p className="text-[#00A8CC] text-3xl md:text-5xl lg:text-6xl font-black italic tracking-widest leading-none drop-shadow-[0_0_15px_rgba(0,168,204,0.3)]">
              2026
            </p>
            
            {isAdmin && (
              <div className="flex justify-center mt-6 animate-in zoom-in duration-500">
                <button 
                  onClick={() => router.push('/importar')} 
                  className="px-8 py-4 bg-green-500 text-white rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] hover:bg-green-600 transition-all shadow-[0_10px_40px_-10px_rgba(34,197,94,0.6)] animate-bounce leading-none flex items-center gap-3"
                >
                  <span className="text-base">⚙️</span> Painel de Controle
                </button>
              </div>
            )}
          </div>

          {/* Cards das Marcas */}
          <div className="flex flex-col md:flex-row gap-6 md:gap-10 max-w-6xl w-full justify-center items-center px-4">
            <div 
              onClick={() => { setMarcaSelecionada('URBA'); setView('CATALOGO'); }} 
              className="group cursor-pointer bg-slate-900/40 p-5 md:p-6 rounded-[2.5rem] md:rounded-[3rem] border-2 border-white/5 hover:border-[#00A8CC] transition-all duration-500 w-full max-w-[320px] md:max-w-sm shadow-2xl leading-none"
            >
              <div className="bg-white rounded-[2rem] aspect-[2/1] flex items-center justify-center p-6 shadow-inner overflow-hidden leading-none">
                <img 
                  src="https://agygfdeizpfcdzxpukpx.supabase.co/storage/v1/object/public/catalog-images/logos/urba_logo.png" 
                  className="w-full h-full object-contain bg-white group-hover:scale-110 transition-transform duration-500" 
                  alt="URBA" 
                />
              </div>
              <p className="text-center text-white/20 text-[10px] font-bold uppercase tracking-[0.5em] mt-5 md:mt-6 group-hover:text-[#00A8CC] leading-none italic transition-colors font-sans">
                {t.enter} Urba
              </p>
            </div>

            <div 
              onClick={() => { setMarcaSelecionada('BROSOL'); setView('CATALOGO'); }} 
              className="group cursor-pointer bg-slate-900/40 p-5 md:p-6 rounded-[2.5rem] md:rounded-[3rem] border-2 border-white/5 hover:border-[#FFD700] transition-all duration-500 w-full max-w-[320px] md:max-w-sm shadow-2xl leading-none"
            >
              <div className="bg-white rounded-[2rem] aspect-[2/1] flex items-center justify-center p-6 shadow-inner overflow-hidden leading-none">
                <img 
                  src="https://agygfdeizpfcdzxpukpx.supabase.co/storage/v1/object/public/catalog-images/logos/brosol_logo.png" 
                  className="w-full h-full object-contain bg-white group-hover:scale-110 transition-transform duration-500" 
                  alt="BROSOL" 
                />
              </div>
              <p className="text-center text-white/20 text-[10px] font-bold uppercase tracking-[0.5em] mt-5 md:mt-6 group-hover:text-[#FFD700] leading-none italic transition-colors font-sans">
                {t.enter} Brosol
              </p>
            </div>
          </div>
        </div>

        {/* Modal de Login */}
        {showLoginModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md leading-none">
            <div className="bg-[#1e293b] border border-white/10 p-10 rounded-[2.5rem] w-full max-w-md shadow-2xl leading-none text-white font-sans">
              <h2 className="text-white font-black text-2xl mb-6 uppercase text-center">{t.loginTitle}</h2>
              <form onSubmit={handleLogin} className="space-y-4 leading-none">
                <input name="user" required placeholder={t.userPlaceholder} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:ring-2 focus:ring-[#00A8CC]" />
                <input name="pass" type="password" required placeholder={t.passPlaceholder} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:ring-2 focus:ring-[#00A8CC]" />
                <button type="submit" className="w-full bg-[#00A8CC] text-white font-black py-4 rounded-2xl hover:brightness-110 transition-all uppercase tracking-widest text-sm">{t.loginBtn}</button>
                <button type="button" onClick={() => setShowLoginModal(false)} className="w-full text-white/30 text-[10px] font-black uppercase mt-4 text-center">{t.cancelBtn}</button>
              </form>
            </div>
          </div>
        )}
      </main>
    );
  }

  return <CatalogoPage marcaInicial={marcaSelecionada} onBack={() => setView('HOME')} isAdmin={isAdmin} onLogout={handleLogout} />;
}