'use client';
import { useState, useEffect, useMemo } from 'react';
import { useCatalog } from '../../hooks/useCatalog';
import { useRouter } from 'next/navigation';

// Cache global para não recarregar imagens já validadas
const globalImageCache = new Map<string, string[]>();

export default function AppContainer() {
  const router = useRouter();
  const [view, setView] = useState<'HOME' | 'CATALOGO'>('HOME');
  const [marcaSelecionada, setMarcaSelecionada] = useState<'URBA' | 'BROSOL'>('URBA');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Lógica de Login
  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const user = formData.get('user');
    const pass = formData.get('pass');

    if (user === 'admin' && pass === 'admin123') {
      setIsAdmin(true);
      setShowLoginModal(false);
    } else {
      alert('Usuário ou senha incorretos');
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    alert('Sessão administrativa encerrada.');
  };

  // --- 1. TELA DE CAPA (CARA DO PROGRAMA 2026) ---
  if (view === 'HOME') {
    return (
      <main className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center p-4 relative font-sans overflow-hidden">
        
        {/* Botão de Status Admin */}
        <button 
          onClick={() => isAdmin ? handleLogout() : setShowLoginModal(true)}
          className={`absolute top-8 right-8 text-[10px] font-black uppercase tracking-[0.2em] border px-4 py-2 rounded-full transition-all z-50 ${
            isAdmin ? 'text-green-400 border-green-400/30 hover:bg-green-400/10' : 'text-white/40 border-white/10 hover:bg-white/5'
          }`}
        >
          {isAdmin ? '● Admin Ativo (Sair)' : 'Acesso Administrativo'}
        </button>

        <div className="text-center mb-16 z-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
          <h1 className="text-white text-4xl lg:text-7xl font-black uppercase tracking-tighter leading-none mb-4">
            Catálogo de Produtos
          </h1>
          <p className="text-[#00A8CC] text-3xl lg:text-5xl font-black italic tracking-widest leading-none">2026</p>
          
          {/* Botão do Painel de Controle - Aparece na capa após login */}
          {isAdmin && (
            <button 
              onClick={() => router.push('/importar')}
              className="mt-10 px-10 py-4 bg-green-500 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-green-600 transition-all shadow-[0_0_30px_-5px_rgba(34,197,94,0.5)] animate-in zoom-in duration-500"
            >
              ⚙️ Abrir Painel de Controle
            </button>
          )}
        </div>

        {/* Cards de Marcas */}
        <div className="flex flex-col md:flex-row gap-10 max-w-6xl w-full justify-center items-center px-4 z-10">
          <div onClick={() => { setMarcaSelecionada('URBA'); setView('CATALOGO'); }} className="group cursor-pointer bg-slate-900/50 p-6 rounded-[3rem] border-2 border-white/5 hover:border-[#00A8CC] transition-all duration-500 w-full max-w-sm shadow-xl">
            <div className="bg-white rounded-[2rem] aspect-[2/1] flex items-center justify-center overflow-hidden p-6 shadow-inner">
              <img src="https://agygfdeizpfcdzxpukpx.supabase.co/storage/v1/object/public/catalog-images/logos/urba_logo.png" className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" alt="URBA" />
            </div>
            <p className="text-center text-white/20 text-[10px] font-bold uppercase tracking-[0.5em] mt-6 group-hover:text-[#00A8CC] transition-colors leading-none italic">Entrar Urba</p>
          </div>

          <div onClick={() => { setMarcaSelecionada('BROSOL'); setView('CATALOGO'); }} className="group cursor-pointer bg-slate-900/50 p-6 rounded-[3rem] border-2 border-white/5 hover:border-[#FFD700] transition-all duration-500 w-full max-w-sm shadow-xl">
            <div className="bg-white rounded-[2rem] aspect-[2/1] flex items-center justify-center overflow-hidden p-6 shadow-inner">
              <img src="https://agygfdeizpfcdzxpukpx.supabase.co/storage/v1/object/public/catalog-images/logos/brosol_logo.png" className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" alt="BROSOL" />
            </div>
            <p className="text-center text-white/20 text-[10px] font-bold uppercase tracking-[0.5em] mt-6 group-hover:text-[#FFD700] transition-colors leading-none italic">Entrar Brosol</p>
          </div>
        </div>

        {/* Modal de Login */}
        {showLoginModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
            <div className="bg-[#1e293b] border border-white/10 p-10 rounded-[2.5rem] w-full max-w-md shadow-2xl">
              <h2 className="text-white font-black text-2xl mb-6 uppercase tracking-tighter leading-none">Autenticação Admin</h2>
              <form onSubmit={handleLogin} className="space-y-4">
                <input name="user" required placeholder="Usuário" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:ring-2 focus:ring-[#00A8CC]" />
                <input name="pass" type="password" required placeholder="Senha" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:ring-2 focus:ring-[#00A8CC]" />
                <button type="submit" className="w-full bg-[#00A8CC] text-white font-black py-4 rounded-2xl hover:brightness-110 transition-all uppercase tracking-widest text-sm leading-none">Entrar</button>
                <button type="button" onClick={() => setShowLoginModal(false)} className="w-full text-white/30 text-[10px] font-black uppercase mt-4 hover:text-white transition-colors leading-none">Cancelar</button>
              </form>
            </div>
          </div>
        )}
      </main>
    );
  }

  // --- 2. RENDERIZAÇÃO DO CATÁLOGO TÉCNICO (MANTENDO TODAS AS FUNÇÕES) ---
  return <CatalogoPage marcaInicial={marcaSelecionada} onBack={() => setView('HOME')} isAdmin={isAdmin} />;
}

function CatalogoPage({ marcaInicial, onBack, isAdmin }: any) {
  const [marca, setMarca] = useState<'URBA' | 'BROSOL'>(marcaInicial);
  const [busca, setBusca] = useState(''); 
  const [buscaGeral, setBuscaGeral] = useState(''); 
  const [filtrosSelecionados, setFiltrosSelecionados] = useState<any>({});
  const [menuAberto, setMenuAberto] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState<any>(null);
  
  const { produtos, loading, buscar } = useCatalog(marca);
  const STORAGE_URL = `https://agygfdeizpfcdzxpukpx.supabase.co/storage/v1/object/public/catalog-images`;

  const temas = {
    URBA: { sidebarBg: 'bg-slate-950', accentColor: '#00A8CC', buttonBg: 'bg-[#00A8CC]', buttonText: 'text-white', logoUrl: `${STORAGE_URL}/logos/urba_logo.png`, inputFocus: 'focus:ring-[#00A8CC]', badge: 'bg-[#00A8CC] text-white' },
    BROSOL: { sidebarBg: 'bg-[#2B3990]', accentColor: '#FFD700', buttonBg: 'bg-[#FFD700]', buttonText: 'text-[#2B3990]', logoUrl: `${STORAGE_URL}/logos/brosol_logo.png`, inputFocus: 'focus:ring-[#FFD700]', badge: 'bg-[#FFD700] text-[#2B3990]' }
  };

  const temaAtivo = temas[marca];

  useEffect(() => {
    buscar(busca, filtrosSelecionados, buscaGeral);
  }, [marca, busca, filtrosSelecionados, buscaGeral]);

  const limparFiltroIndividual = (chave: string) => {
    if (chave === 'codigo') setBusca('');
    else if (chave === 'geral') setBuscaGeral('');
    else {
      const novos = { ...filtrosSelecionados };
      delete novos[chave];
      setFiltrosSelecionados(novos);
    }
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
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-100 font-sans antialiased text-slate-900">
      
      <aside className={`fixed lg:sticky top-0 z-[80] w-80 shadow-2xl h-screen p-6 flex flex-col transition-all duration-500 ${temaAtivo.sidebarBg} text-white ${menuAberto ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        
        <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-white/10 w-full aspect-[2/1] flex items-center justify-center p-4 mb-6">
           <img src={temaAtivo.logoUrl} className="w-full h-full object-contain" alt="Logo" />
        </div>

        <button onClick={onBack} className="mb-8 flex items-center gap-2 text-white/50 hover:text-white transition-colors font-bold text-xs uppercase tracking-widest leading-none">
          <span>←</span> Menu Inicial
        </button>

        <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar pb-10">
          {/* Seleção de Marca dentro do Catálogo */}
          <div>
            <label className="text-[10px] font-black text-white/40 uppercase mb-3 block leading-none">Fabricante</label>
            <div className="grid grid-cols-2 gap-2 bg-black/30 p-1 rounded-xl border border-white/10 text-white">
              <button onClick={() => setMarca('URBA')} className={`py-2 rounded-lg text-xs font-bold transition-all ${marca === 'URBA' ? 'bg-[#00A8CC] text-white shadow-lg' : 'text-white/40'}`}>URBA</button>
              <button onClick={() => setMarca('BROSOL')} className={`py-2 rounded-lg text-xs font-bold transition-all ${marca === 'BROSOL' ? 'bg-[#FFD700] text-[#2B3990] shadow-lg' : 'text-white/40'}`}>BROSOL</button>
            </div>
          </div>

          <div className="space-y-6 text-white">
            {/* BUSCA GERAL */}
            <div className="relative">
              <div className="flex justify-between items-center mb-2">
                <label className="text-[10px] font-black uppercase ml-1 leading-none" style={{ color: temaAtivo.accentColor }}>Pesquisa Geral</label>
                {buscaGeral && <button onClick={() => limparFiltroIndividual('geral')} className="text-[9px] text-red-400 font-bold uppercase leading-none">Limpar</button>}
              </div>
              <input value={buscaGeral} onChange={(e) => setBuscaGeral(e.target.value)} placeholder="O que busca?" className={`w-full bg-black/20 border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:ring-2 ${temaAtivo.inputFocus}`} />
            </div>

            {/* BUSCA POR CÓDIGO */}
            <div className="relative">
              <div className="flex justify-between items-center mb-2">
                <label className="text-[10px] font-black text-white/40 uppercase ml-1 leading-none">Código</label>
                {busca && <button onClick={() => limparFiltroIndividual('codigo')} className="text-[9px] text-red-400 font-bold uppercase leading-none">Limpar</button>}
              </div>
              <input list="list-codigos" value={busca} onChange={(e) => setBusca(e.target.value.toUpperCase())} className={`w-full bg-black/20 border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:ring-2 ${temaAtivo.inputFocus}`} />
              <datalist id="list-codigos">{opcoesFiltros.codigos.map(c => <option key={c} value={c} />)}</datalist>
            </div>

            {/* FILTRO VEÍCULO */}
            <div className="relative">
              <div className="flex justify-between items-center mb-2">
                <label className="text-[10px] font-black text-white/40 uppercase ml-1 leading-none">Veículo / Aplicação</label>
                {filtrosSelecionados['Veículos'] && <button onClick={() => limparFiltroIndividual('Veículos')} className="text-[9px] text-red-400 font-bold uppercase leading-none">Limpar</button>}
              </div>
              <input list="list-veiculos" value={filtrosSelecionados['Veículos'] || ''} onChange={(e) => setFiltrosSelecionados({...filtrosSelecionados, 'Veículos': e.target.value})} className={`w-full bg-black/20 border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:ring-2 ${temaAtivo.inputFocus}`} />
              <datalist id="list-veiculos">{opcoesFiltros.veiculos.map(v => <option key={v} value={v} />)}</datalist>
            </div>

            {/* FILTRO LINHA/GRUPO */}
            <div className="relative">
              <div className="flex justify-between items-center mb-2">
                <label className="text-[10px] font-black text-white/40 uppercase ml-1 leading-none">Linha (Grupo)</label>
                {filtrosSelecionados['Grupo'] && <button onClick={() => limparFiltroIndividual('Grupo')} className="text-[9px] text-red-400 font-bold uppercase leading-none">Limpar</button>}
              </div>
              <input list="list-grupos" value={filtrosSelecionados['Grupo'] || ''} onChange={(e) => setFiltrosSelecionados({...filtrosSelecionados, 'Grupo': e.target.value})} className={`w-full bg-black/20 border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:ring-2 ${temaAtivo.inputFocus}`} />
              <datalist id="list-grupos">{opcoesFiltros.grupos.map(g => <option key={g} value={g} />)}</datalist>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-4 lg:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {loading ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse text-slate-900">
                {[1,2,3,4,5,6].map(i => <div key={i} className="h-96 bg-white rounded-[2.5rem]"></div>)}
             </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-slate-900">
              {produtos.map(produto => (
                <div key={produto.id} className="bg-white rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 flex flex-col group overflow-hidden">
                  <div className="aspect-[4/3] bg-slate-50 flex items-center justify-center p-8 relative min-h-[220px]">
                    {produto.dados['Lançamento'] === 'Sim' && <span className={`absolute top-6 left-6 text-[10px] font-black px-4 py-1.5 rounded-full z-10 shadow-md uppercase tracking-wider ${temaAtivo.badge} leading-none`}>Lançamento</span>}
                    <img src={`${STORAGE_URL}/${marca.toLowerCase()}/${produto.codigo_produto.toLowerCase()}.jpg`} className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-700" loading="eager" />
                  </div>
                  <div className="p-8 flex flex-col flex-1">
                    <span className="text-3xl font-black tracking-tighter mb-1 uppercase leading-none">{produto.codigo_produto}</span>
                    <p className="text-[10px] font-black uppercase tracking-widest mb-4 leading-none" style={{ color: temaAtivo.accentColor }}>{produto.dados['Grupo']}</p>
                    <p className="text-xs text-slate-400 line-clamp-3 mb-6 italic leading-tight">{produto.dados['Veículos']}</p>
                    <button onClick={() => setProdutoSelecionado(produto)} className={`w-full mt-auto font-black py-4 rounded-2xl shadow-lg transition-all active:scale-95 ${temaAtivo.buttonBg} ${temaAtivo.buttonText} uppercase text-xs leading-none`}>Detalhes</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* MODAL DETALHES COM GALERIA TÉCNICA */}
      {produtoSelecionado && <ModalDetalhes produto={produtoSelecionado} marca={marca} storageUrl={STORAGE_URL} onClose={() => setProdutoSelecionado(null)} temaAtivo={temaAtivo} />}
    </div>
  );
}

function ModalDetalhes({ produto, marca, storageUrl, onClose, temaAtivo }: any) {
  const [fotos, setFotos] = useState<string[]>([]);
  const [fotoAtiva, setFotoAtiva] = useState('');
  const [loadingGaleria, setLoadingGaleria] = useState(true);

  useEffect(() => {
    let montado = true;
    const cod = produto.codigo_produto.toLowerCase();
    const carregar = async () => {
      const sufixos = ['', '_a', '_b', '_c', '_d'];
      const caminhos = sufixos.map(s => `${storageUrl}/${marca.toLowerCase()}/${cod}${s}.jpg`);
      const checagens = await Promise.all(caminhos.map(url => fetch(url, { method: 'HEAD' }).then(res => res.ok ? url : null).catch(() => null)));
      if (!montado) return;
      const encontradas = checagens.filter((u): u is string => u !== null);
      const res = encontradas.length > 0 ? encontradas : ['https://via.placeholder.com/400x300?text=Sem+Imagem'];
      setFotos(res);
      setFotoAtiva(res[0]);
      setLoadingGaleria(false);
    };
    carregar();
    return () => { montado = false; };
  }, [produto]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4 bg-slate-900/95 backdrop-blur-md">
      <div className="relative bg-white w-full h-full lg:h-auto lg:max-h-[95vh] lg:max-w-6xl lg:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row border border-slate-100 text-slate-900 font-sans">
        <button onClick={onClose} className="absolute top-6 right-6 z-20 bg-slate-100 w-12 h-12 rounded-full font-bold shadow-md hover:bg-red-500 hover:text-white transition-all text-slate-900 flex items-center justify-center">✕</button>
        <div className="lg:w-1/2 bg-slate-50 p-8 flex flex-col items-center justify-center min-h-[400px] relative text-slate-900">
          {loadingGaleria ? <div className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: temaAtivo.accentColor }}></div> : (
            <>
              <div className="flex-1 flex items-center justify-center w-full"><img src={fotoAtiva} className="max-h-[450px] max-w-full object-contain drop-shadow-2xl" alt="Produto" /></div>
              {fotos.length > 1 && (
                <div className="flex gap-3 mt-6 p-2 overflow-x-auto max-w-full custom-scrollbar">
                  {fotos.map((url, i) => (
                    <button key={i} onClick={() => setFotoAtiva(url)} className={`w-16 h-16 flex-shrink-0 rounded-xl border-2 transition-all ${fotoAtiva === url ? 'scale-105 shadow-md' : 'opacity-40'}`} style={{ borderColor: fotoAtiva === url ? temaAtivo.accentColor : 'transparent' }}><img src={url} className="w-full h-full object-contain" alt="Miniatura" /></button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
        <div className="lg:w-1/2 p-10 lg:p-14 overflow-y-auto bg-white flex flex-col flex-1 text-slate-900 font-sans">
          <div className="mb-10 text-slate-900 leading-none"><span className="font-black text-xs tracking-widest uppercase mb-2 block leading-none font-sans" style={{ color: temaAtivo.accentColor }}>{marca}</span><h2 className="text-5xl font-black tracking-tighter uppercase leading-none font-sans">{produto.codigo_produto}</h2></div>
          <div className="space-y-6 flex-1 text-slate-900 font-sans">
            {Object.entries(produto.dados).map(([key, value]) => (
              value && !['id', 'Arquivo Foto', 'codigo_produto', 'Descrição Produto', 'Lançamento'].includes(key) && (
                <div key={key} className="border-b border-slate-50 pb-3 text-slate-900 leading-none font-sans"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none font-sans">{key}</span><p className="text-slate-800 font-bold leading-tight mt-1 leading-none font-sans">{String(value)}</p></div>
              )
            ))}
          </div>
          <button onClick={onClose} className={`mt-12 w-full font-black py-5 rounded-2xl shadow-xl transition-all active:scale-95 ${temaAtivo.buttonBg} ${temaAtivo.buttonText} uppercase text-xs leading-none font-sans`}>Voltar</button>
        </div>
      </div>
    </div>
  );
}