'use client';
import { useState, useEffect, useMemo } from 'react';
import { useCatalog } from '../../hooks/useCatalog';
import { useRouter } from 'next/navigation';

// --- 1. DICIONÁRIO DE INTERFACE (UI) ---
const translations = {
  PT: {
    title: "Catálogo de Produtos",
    admin: "Acesso Administrativo",
    adminActive: "● Admin Ativo (Sair)",
    enter: "Entrar",
    searchPlaceholder: "Código, Referência, Motor...",
    generalSearch: "Pesquisa Geral",
    filterCode: "Código",
    filterVehicle: "Veículo / Aplicação",
    filterGroup: "Linha (Grupo)",
    back: "Menu Inicial",
    details: "Detalhes",
    backButton: "Voltar",
    launch: "Lançamento",
    loginTitle: "Autenticação",
    userPlaceholder: "Usuário",
    passPlaceholder: "Senha",
    loginBtn: "Entrar",
    cancelBtn: "Cancelar",
    manufacturer: "Fabricante"
  },
  ES: {
    title: "Catálogo de Productos",
    admin: "Acceso Administrativo",
    adminActive: "● Admin Activo (Salir)",
    enter: "Enter",
    searchPlaceholder: "Código, Referencia, Motor...",
    generalSearch: "Búsqueda General",
    filterCode: "Código",
    filterVehicle: "Vehículo / Aplicación",
    filterGroup: "Línea (Grupo)",
    back: "Menú Principal",
    details: "Detalles",
    backButton: "Volver",
    launch: "Lanzamiento",
    loginTitle: "Autenticación",
    userPlaceholder: "Usuario",
    passPlaceholder: "Contraseña",
    loginBtn: "Entrar",
    cancelBtn: "Cancelar",
    manufacturer: "Fabricante"
  },
  EN: {
    title: "Product Catalog",
    admin: "Administrative Access",
    adminActive: "● Admin Active (Logout)",
    enter: "Enter",
    searchPlaceholder: "Code, Reference, Engine...",
    generalSearch: "General Search",
    filterCode: "Code",
    filterVehicle: "Vehicle / Application",
    filterGroup: "Line (Group)",
    back: "Main Menu",
    details: "Details",
    backButton: "Back",
    launch: "New Release",
    loginTitle: "Authentication",
    userPlaceholder: "Username",
    passPlaceholder: "Password",
    loginBtn: "Login",
    cancelBtn: "Cancel",
    manufacturer: "Manufacturer"
  }
};

// --- 2. MAPEAMENTO DE LABELS DO BANCO (CORRIGIDO) ---
const dataTerms: any = {
  PT: { "Grupo": "Linha (Grupo)", "Veículos": "Veículo / Aplicação", "Números Referência": "Referências", "Observação": "Observação", "Motor": "Motor" },
  ES: { "Grupo": "Línea (Grupo)", "Veículos": "Vehículo / Aplicación", "Números Referência": "Referencias", "Observação": "Observación", "Motor": "Motor" },
  EN: { "Grupo": "Line (Group)", "Veículos": "Vehicle / Application", "Números Referência": "Cross References", "Observação": "Note", "Motor": "Engine" }
};

export default function AppContainer() {
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
      <main className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center p-4 relative font-sans overflow-hidden text-white leading-none">
        
        <div className="absolute top-6 left-6 flex gap-4 z-50">
          <button onClick={() => setLang('PT')} className={`text-2xl transition-all hover:scale-125 ${lang === 'PT' ? 'opacity-100' : 'opacity-30 grayscale'}`}>🇧🇷</button>
          <button onClick={() => setLang('ES')} className={`text-2xl transition-all hover:scale-125 ${lang === 'ES' ? 'opacity-100' : 'opacity-30 grayscale'}`}>🇪🇸</button>
          <button onClick={() => setLang('EN')} className={`text-2xl transition-all hover:scale-125 ${lang === 'EN' ? 'opacity-100' : 'opacity-30 grayscale'}`}>🇺🇸</button>
        </div>

        <button 
          onClick={() => isAdmin ? handleLogout() : setShowLoginModal(true)}
          className={`absolute top-6 md:top-8 right-4 md:right-8 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] border px-4 py-2 rounded-full transition-all z-50 ${
            isAdmin ? 'text-green-400 border-green-400/30 bg-green-400/5' : 'text-white/30 border-white/10 bg-white/5'
          } hover:bg-white/10 active:scale-95 leading-none font-sans`}
        >
          {isAdmin ? t.adminActive : t.admin}
        </button>

        <div className="text-center mb-12 md:mb-20 z-10 mt-16 md:mt-0 leading-none">
          <h1 className="text-white text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.85] mb-2 font-sans">
            {t.title.split(' ')[0]} <br className="md:hidden" /> {t.title.split(' ').slice(1).join(' ')}
          </h1>
          <p className="text-[#00A8CC] text-4xl md:text-6xl lg:text-7xl font-black italic tracking-widest leading-none drop-shadow-[0_0_15px_rgba(0,168,204,0.3)]">2026</p>
          
          {isAdmin && (
            <div className="flex justify-center mt-10 animate-in zoom-in duration-500">
              <button onClick={() => router.push('/importar')} className="px-8 py-4 bg-green-500 text-white rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] hover:bg-green-600 transition-all shadow-[0_10px_40px_-10px_rgba(34,197,94,0.6)] animate-bounce leading-none flex items-center gap-3">
                <span className="text-base">⚙️</span> Painel de Controle
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-6 md:gap-10 max-w-6xl w-full justify-center items-center px-4 z-10 leading-none">
          <div onClick={() => { setMarcaSelecionada('URBA'); setView('CATALOGO'); }} className="group cursor-pointer bg-slate-900/40 p-5 md:p-6 rounded-[2.5rem] md:rounded-[3rem] border-2 border-white/5 hover:border-[#00A8CC] transition-all duration-500 w-full max-w-[320px] md:max-w-sm shadow-2xl leading-none">
            <div className="bg-white rounded-[2rem] aspect-[2/1] flex items-center justify-center p-6 shadow-inner overflow-hidden leading-none">
              <img src="https://agygfdeizpfcdzxpukpx.supabase.co/storage/v1/object/public/catalog-images/logos/urba_logo.png" className="w-full h-full object-contain bg-white group-hover:scale-110 transition-transform duration-500" alt="URBA" />
            </div>
            <p className="text-center text-white/20 text-[10px] font-bold uppercase tracking-[0.5em] mt-5 md:mt-6 group-hover:text-[#00A8CC] leading-none italic transition-colors font-sans">{t.enter} Urba</p>
          </div>

          <div onClick={() => { setMarcaSelecionada('BROSOL'); setView('CATALOGO'); }} className="group cursor-pointer bg-slate-900/40 p-5 md:p-6 rounded-[2.5rem] md:rounded-[3rem] border-2 border-white/5 hover:border-[#FFD700] transition-all duration-500 w-full max-w-[320px] md:max-w-sm shadow-2xl leading-none">
            <div className="bg-white rounded-[2rem] aspect-[2/1] flex items-center justify-center p-6 shadow-inner overflow-hidden leading-none">
              <img src="https://agygfdeizpfcdzxpukpx.supabase.co/storage/v1/object/public/catalog-images/logos/brosol_logo.png" className="w-full h-full object-contain bg-white group-hover:scale-110 transition-transform duration-500" alt="BROSOL" />
            </div>
            <p className="text-center text-white/20 text-[10px] font-bold uppercase tracking-[0.5em] mt-5 md:mt-6 group-hover:text-[#FFD700] leading-none italic transition-colors font-sans">{t.enter} Brosol</p>
          </div>
        </div>

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

  return <CatalogoPage marcaInicial={marcaSelecionada} onBack={() => setView('HOME')} isAdmin={isAdmin} onLogout={handleLogout} t={t} lang={lang} setLang={setLang} terms={dataTerms[lang]} />;
}

function CatalogoPage({ marcaInicial, onBack, isAdmin, onLogout, t, lang, setLang, terms }: any) {
  const [marca, setMarca] = useState<'URBA' | 'BROSOL'>(marcaInicial);
  const [busca, setBusca] = useState(''); 
  const [buscaGeral, setBuscaGeral] = useState(''); 
  const [filtrosSelecionados, setFiltrosSelecionados] = useState<any>({});
  const [menuAberto, setMenuAberto] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState<any>(null);
  
  const { produtos, loading, buscar } = useCatalog(marca);
  const STORAGE_URL = `https://agygfdeizpfcdzxpukpx.supabase.co/storage/v1/object/public/catalog-images`;

  const temas = {
    URBA: { sidebarBg: 'bg-slate-950', accentColor: '#00A8CC', badge: 'bg-[#00A8CC] text-white' },
    BROSOL: { sidebarBg: 'bg-[#2B3990]', accentColor: '#FFD700', badge: 'bg-[#FFD700] text-[#2B3990]' }
  };

  const temaAtivo = temas[marca];

  // --- BUSCA PROFUNDA ---
  const produtosFiltrados = useMemo(() => {
    return produtos.filter(p => {
      if (!buscaGeral) return true;
      const termo = buscaGeral.toLowerCase().trim();
      const todosOsDados = Object.values(p.dados).map(v => String(v).toLowerCase().replace(/\s+/g, ' ')).join(' ');
      const codigo = (p.codigo_produto || "").toLowerCase();
      return codigo.includes(termo) || todosOsDados.includes(termo);
    });
  }, [produtos, buscaGeral]);

  useEffect(() => { buscar(busca, filtrosSelecionados, ""); }, [marca, busca, filtrosSelecionados]);

  const limparFiltroIndividual = (chave: string) => {
    if (chave === 'codigo') setBusca('');
    else if (chave === 'geral') setBuscaGeral('');
    else { const novos = { ...filtrosSelecionados }; delete novos[chave]; setFiltrosSelecionados(novos); }
  };

  const opcoesFiltros = useMemo(() => {
    const grupos = new Set<string>(), veiculosSet = new Set<string>(), codigos = new Set<string>();
    produtos.forEach(p => {
      if (p.codigo_produto) codigos.add(p.codigo_produto.toUpperCase());
      if (p.dados['Grupo']) grupos.add(p.dados['Grupo'].trim());
      if (p.dados['Veículos']) {
        p.dados['Veículos'].split(/[\n,;]/).forEach((v: string) => {
          const nome = v.split(':')[0].trim();
          if (nome && nome.length > 2) veiculosSet.add(nome.toUpperCase());
        });
      }
    });
    return { codigos: Array.from(codigos).sort(), grupos: Array.from(grupos).sort(), veiculos: Array.from(veiculosSet).sort() };
  }, [produtos]);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-100 font-sans antialiased text-slate-900 leading-none">
      
      <header className={`lg:hidden sticky top-0 z-[60] flex items-center justify-between p-4 shadow-xl ${temaAtivo.sidebarBg} leading-none`}>
        <div className="h-10 w-32 bg-white rounded-xl overflow-hidden flex items-center justify-center p-1 leading-none">
          <img src={`https://agygfdeizpfcdzxpukpx.supabase.co/storage/v1/object/public/catalog-images/logos/${marca.toLowerCase()}_logo.png`} className="max-h-full max-w-full object-contain" alt="Logo" />
        </div>
        <button onClick={() => setMenuAberto(true)} className="px-4 py-2 rounded-xl bg-white/10 text-white font-black text-[10px] uppercase border border-white/20 leading-none">Filtros</button>
      </header>

      {menuAberto && <div className="fixed inset-0 bg-black/70 z-[70] lg:hidden leading-none" onClick={() => setMenuAberto(false)} />}

      <aside className={`fixed lg:sticky top-0 z-[80] w-[300px] sm:w-80 shadow-2xl h-screen p-6 flex flex-col transition-all duration-500 ${temaAtivo.sidebarBg} text-white leading-none ${menuAberto ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        
        <div className="flex gap-4 mb-6 justify-center">
          {['PT', 'ES', 'EN'].map(l => (
            <button key={l} onClick={() => setLang(l as any)} className={`text-xl transition-all ${lang === l ? 'opacity-100' : 'opacity-30 grayscale'}`}>{l === 'PT' ? '🇧🇷' : l === 'ES' ? '🇪🇸' : '🇺🇸'}</button>
          ))}
        </div>

        <div className="mb-10 w-full hidden lg:block leading-none"> 
          <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-white/10 w-full aspect-[2/1] flex items-center justify-center p-4 leading-none text-slate-900">
             <img src={`https://agygfdeizpfcdzxpukpx.supabase.co/storage/v1/object/public/catalog-images/logos/${marca.toLowerCase()}_logo.png`} className="w-full h-full object-contain" alt="Logo" />
          </div>
        </div>
        <button onClick={onBack} className="mb-8 flex items-center gap-2 text-white/50 hover:text-white transition-colors font-bold text-xs uppercase tracking-widest leading-none"><span>←</span> {t.back}</button>
        
        {isAdmin && (
          <div className="mb-6 p-4 bg-white/10 rounded-2xl border border-white/20 text-center leading-none">
            <p className="text-[10px] font-black uppercase text-green-400 mb-2 tracking-widest leading-none font-sans">Admin Logado</p>
            <button onClick={onLogout} className="w-full py-2 bg-red-500/20 text-red-400 rounded-xl font-black text-[9px] uppercase border border-red-500/30 leading-none font-sans">Sair do Admin</button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar pb-10 leading-none text-white font-sans">
          <div className="leading-none">
            <label className="text-[10px] font-black text-white/40 uppercase mb-3 block leading-none tracking-widest font-sans">{t.manufacturer}</label>
            <div className="grid grid-cols-2 gap-2 bg-black/30 p-1 rounded-xl border border-white/10 leading-none">
              <button onClick={() => setMarca('URBA')} className={`py-2 rounded-lg text-xs font-bold transition-all leading-none ${marca === 'URBA' ? 'bg-[#00A8CC] text-white shadow-lg' : 'text-white/40'}`}>URBA</button>
              <button onClick={() => setMarca('BROSOL')} className={`py-2 rounded-lg text-xs font-bold transition-all leading-none ${marca === 'BROSOL' ? 'bg-[#FFD700] text-[#2B3990] shadow-lg' : 'text-white/40'}`}>BROSOL</button>
            </div>
          </div>

          <div className="space-y-6 text-white leading-none font-sans">
            <div className="relative leading-none">
              <div className="flex justify-between items-center mb-2 leading-none">
                <label className="text-[10px] font-black uppercase ml-1 leading-none font-sans" style={{ color: temaAtivo.accentColor }}>{t.generalSearch}</label>
                {buscaGeral && <button onClick={() => limparFiltroIndividual('geral')} className="text-[9px] text-red-400 font-bold uppercase leading-none font-sans">Limpar</button>}
              </div>
              <input value={buscaGeral} onChange={(e) => setBuscaGeral(e.target.value)} placeholder={t.searchPlaceholder} className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:ring-1 focus:ring-white/20 font-sans leading-none" />
            </div>

            <div className="relative leading-none">
              <label className="text-[10px] font-black text-white/40 uppercase ml-1 block mb-2 leading-none font-sans">{t.filterCode}</label>
              <input list="list-codigos" value={busca} onChange={(e) => setBusca(e.target.value.toUpperCase())} className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-sm text-white outline-none font-sans leading-none" />
              <datalist id="list-codigos" className="leading-none">{opcoesFiltros.codigos.map(c => <option key={c} value={c} className="leading-none" />)}</datalist>
            </div>

            <div className="relative leading-none">
              <label className="text-[10px] font-black text-white/40 uppercase ml-1 block mb-2 leading-none font-sans">{t.filterVehicle}</label>
              <input list="list-veiculos" value={filtrosSelecionados['Veículos'] || ''} onChange={(e) => setFiltrosSelecionados({...filtrosSelecionados, 'Veículos': e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-sm text-white outline-none font-sans leading-none" />
              <datalist id="list-veiculos" className="leading-none">{opcoesFiltros.veiculos.map(v => <option key={v} value={v} className="leading-none" />)}</datalist>
            </div>

            <div className="relative leading-none">
              <label className="text-[10px] font-black text-white/40 uppercase ml-1 block mb-2 leading-none font-sans">{t.filterGroup}</label>
              <input list="list-grupos" value={filtrosSelecionados['Grupo'] || ''} onChange={(e) => setFiltrosSelecionados({...filtrosSelecionados, 'Grupo': e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-sm text-white outline-none font-sans leading-none" />
              <datalist id="list-grupos" className="leading-none">{opcoesFiltros.grupos.map(g => <option key={g} value={g} className="leading-none" />)}</datalist>
            </div>
          </div>
          <button onClick={() => setMenuAberto(false)} className="lg:hidden w-full py-4 rounded-2xl font-black text-xs uppercase shadow-xl bg-white text-slate-900 leading-none font-sans">Aplicar Filtros</button>
        </div>
      </aside>

      <main className="flex-1 p-4 lg:p-10 overflow-y-auto leading-none text-slate-900">
        <div className="max-w-7xl mx-auto leading-none">
          {loading ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse text-slate-900 leading-none">
                {[1,2,3,4,5,6].map(i => <div key={i} className="h-96 bg-white rounded-[2.5rem] leading-none"></div>)}
             </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-slate-900 leading-none">
              {produtosFiltrados.map(p => {
                // --- TRADUÇÃO DO CONTEÚDO DOS GRIDS (NOVA ADIÇÃO) ---
                let grupoTraduzido = p.dados['Grupo'];
                if (lang === 'EN' && p.dados['Grupo Inglês']) grupoTraduzido = p.dados['Grupo Inglês'];
                if (lang === 'ES' && p.dados['Grupo Espanhol']) grupoTraduzido = p.dados['Grupo Espanhol'];

                return (
                  <div key={p.id} className="bg-white rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all border border-slate-100 flex flex-col group overflow-hidden leading-none font-sans">
                    <div className="aspect-[4/3] bg-slate-50 flex items-center justify-center p-8 relative min-h-[220px] leading-none text-slate-900">
                      {p.dados['Lançamento'] === 'Sim' && <span className={`absolute top-6 left-6 text-[10px] font-black px-4 py-1.5 rounded-full z-10 shadow-md uppercase tracking-wider ${temaAtivo.badge} leading-none font-sans`}>{t.launch}</span>}
                      <img src={`${STORAGE_URL}/${marca.toLowerCase()}/${p.codigo_produto.toLowerCase()}.jpg`} className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-700" loading="eager" />
                    </div>
                    <div className="p-8 flex flex-col flex-1 leading-none text-slate-900 font-sans">
                      <span className="text-3xl font-black tracking-tighter mb-1 uppercase font-sans leading-none">{p.codigo_produto}</span>
                      <p className="text-[10px] font-black uppercase tracking-widest mb-4 font-sans leading-none" style={{ color: temaAtivo.accentColor }}>{grupoTraduzido}</p>
                      <p className="text-xs text-slate-400 line-clamp-3 mb-6 italic leading-tight font-sans whitespace-pre-line">{p.dados['Veículos']}</p>
                      <button onClick={() => setProdutoSelecionado(p)} className={`w-full mt-auto font-black py-4 rounded-2xl shadow-lg transition-all active:scale-95 bg-slate-900 text-white uppercase text-xs font-sans leading-none`}>{t.details}</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {produtoSelecionado && <ModalDetalhes produto={produtoSelecionado} marca={marca} storageUrl={STORAGE_URL} onClose={() => setProdutoSelecionado(null)} temaAtivo={temaAtivo} t={t} terms={terms} lang={lang} />}
    </div>
  );
}

function ModalDetalhes({ produto, marca, storageUrl, onClose, temaAtivo, t, terms, lang }: any) {
  const [fotos, setFotos] = useState<string[]>([]);
  const [fotoAtiva, setFotoAtiva] = useState('');

  useEffect(() => {
    let montado = true;
    const cod = produto.codigo_produto.toLowerCase();
    const caminhos = ['', '_a', '_b', '_c', '_d'].map(s => `${storageUrl}/${marca.toLowerCase()}/${cod}${s}.jpg`);
    Promise.all(caminhos.map(url => fetch(url, { method: 'HEAD' }).then(res => res.ok ? url : null).catch(() => null)))
      .then(res => {
        if (!montado) return;
        const encontradas = res.filter((u): u is string => u !== null);
        setFotos(encontradas.length > 0 ? encontradas : ['https://via.placeholder.com/400x300?text=Sem+Imagem']);
        setFotoAtiva(encontradas[0] || '');
      });
    return () => { montado = false; };
  }, [produto]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4 bg-slate-900/95 backdrop-blur-md leading-none font-sans text-slate-900">
      <div className="relative bg-white w-full h-full lg:h-auto lg:max-h-[95vh] lg:max-w-6xl lg:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row border border-slate-100 leading-none">
        <button onClick={onClose} className="absolute top-6 right-6 z-[110] bg-slate-100 w-12 h-12 rounded-full font-bold shadow-md hover:bg-red-500 hover:text-white transition-all flex items-center justify-center leading-none text-slate-950">✕</button>
        <div className="lg:w-1/2 bg-slate-50 p-8 flex flex-col items-center justify-center min-h-[400px] relative leading-none">
          <div className="flex-1 flex items-center justify-center w-full leading-none"><img src={fotoAtiva} className="max-h-[450px] max-w-full object-contain drop-shadow-2xl" alt="Produto" /></div>
          {fotos.length > 1 && (
            <div className="flex gap-3 mt-6 p-2 overflow-x-auto max-w-full custom-scrollbar leading-none font-sans">
              {fotos.map((url, i) => (
                <button key={i} onClick={() => setFotoAtiva(url)} className={`w-16 h-16 flex-shrink-0 rounded-xl border-2 transition-all leading-none ${fotoAtiva === url ? 'scale-105 shadow-md border-slate-900' : 'opacity-40 border-transparent'}`}><img src={url} className="w-full h-full object-contain bg-white rounded-lg" alt="Miniatura" /></button>
              ))}
            </div>
          )}
        </div>
        <div className="lg:w-1/2 p-10 lg:p-14 overflow-hidden bg-white flex flex-col flex-1 leading-none font-sans text-slate-900">
          <div className="mb-10 leading-none font-sans">
            <span className="font-black text-xs tracking-widest uppercase mb-2 block font-sans leading-none" style={{ color: temaAtivo.accentColor }}>{marca}</span>
            <h2 className="text-5xl font-black tracking-tighter uppercase font-sans leading-none">{produto.codigo_produto}</h2>
          </div>
          
          <div className="space-y-6 flex-1 font-sans leading-none overflow-y-auto pr-4 custom-scrollbar text-slate-900">
            {Object.entries(produto.dados).map(([key, value]) => {
              if (!value || ['id', 'Arquivo Foto', 'codigo_produto', 'Lançamento'].includes(key)) return null;
              
              let valorExibido = String(value);
              if (key === 'Grupo') {
                if (lang === 'EN' && produto.dados['Grupo Inglês']) valorExibido = produto.dados['Grupo Inglês'];
                if (lang === 'ES' && produto.dados['Grupo Espanhol']) valorExibido = produto.dados['Grupo Espanhol'];
              }
              if (key === 'Descrição Produto') {
                if (lang === 'EN' && produto.dados['Descrição Inglês']) valorExibido = produto.dados['Descrição Inglês'];
                if (lang === 'ES' && produto.dados['Descrição Espanhol']) valorExibido = produto.dados['Descrição Espanhol'];
              }

              return (
                <div key={key} className="border-b border-slate-50 pb-3 leading-none">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-sans leading-none">{terms[key] || key}</span>
                  <p className="text-slate-800 font-bold leading-tight mt-1 font-sans leading-none whitespace-pre-line">{valorExibido}</p>
                </div>
              );
            })}
          </div>
          <button onClick={onClose} className="mt-12 w-full font-black py-5 rounded-2xl shadow-xl transition-all active:scale-95 bg-slate-900 text-white uppercase text-xs font-sans leading-none flex-shrink-0">{t.backButton}</button>
        </div>
      </div>
    </div>
  );
}