'use client';
import { useState, useEffect, useMemo } from 'react';
import { useCatalog } from '../../hooks/useCatalog';
import Link from 'next/link';

// Cache para persistir as imagens encontradas durante a sessão
const globalImageCache = new Map<string, string[]>();

export default function CatalogoPage() {
  const [marca, setMarca] = useState<'URBA' | 'BROSOL'>('URBA');
  const [busca, setBusca] = useState(''); 
  const [buscaGeral, setBuscaGeral] = useState(''); 
  const [filtrosSelecionados, setFiltrosSelecionados] = useState<any>({});
  const [menuAberto, setMenuAberto] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState<any>(null);
  
  const { produtos, loading, buscar } = useCatalog(marca);

  // Variáveis de ambiente configuradas na Vercel (NEXT_PUBLIC_...)
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://agygfdeizpfcdzxpukpx.supabase.co';
  const STORAGE_URL = `${SUPABASE_URL}/storage/v1/object/public/catalog-images`;

  // --- CONFIGURAÇÃO DE IDENTIDADE VISUAL ---
  const temas = {
    URBA: {
      sidebarBg: 'bg-slate-950',
      accentColor: '#00A8CC', 
      buttonBg: 'bg-[#00A8CC]',
      buttonText: 'text-white',
      logoUrl: `${STORAGE_URL}/logos/urba_logo.png`,
      inputFocus: 'focus:ring-[#00A8CC]',
      badge: 'bg-[#00A8CC] text-white'
    },
    BROSOL: {
      sidebarBg: 'bg-[#2B3990]', 
      accentColor: '#FFD700', 
      buttonBg: 'bg-[#FFD700]',
      buttonText: 'text-[#2B3990]',
      logoUrl: `${STORAGE_URL}/logos/brosol_logo.png`,
      inputFocus: 'focus:ring-[#FFD700]',
      badge: 'bg-[#FFD700] text-[#2B3990]'
    }
  };

  const temaAtivo = temas[marca];

  useEffect(() => {
    buscar(busca, filtrosSelecionados, buscaGeral);
  }, [marca, busca, filtrosSelecionados, buscaGeral]);

  const limparFiltroIndividual = (chave: string) => {
    if (chave === 'codigo') setBusca('');
    else if (chave === 'geral') setBuscaGeral('');
    else {
      const novosFiltros = { ...filtrosSelecionados };
      delete novosFiltros[chave];
      setFiltrosSelecionados(novosFiltros);
    }
  };

  const opcoesFiltros = useMemo(() => {
    const grupos = new Set<string>();
    const veiculosSet = new Set<string>();
    const codigos = new Set<string>();

    produtos.forEach(p => {
      if (p.codigo_produto) codigos.add(p.codigo_produto.toUpperCase());
      if (p.dados['Grupo']) grupos.add(p.dados['Grupo'].trim());
      if (p.dados['Veículos']) {
        const linhas = p.dados['Veículos'].split(/[\n,;]/);
        linhas.forEach((v: string) => {
          const nome = v.split(':')[0].trim();
          if (nome && nome.length > 2) veiculosSet.add(nome.toUpperCase());
        });
      }
    });

    return { 
      codigos: Array.from(codigos).sort(), 
      grupos: Array.from(grupos).sort(), 
      veiculos: Array.from(veiculosSet).sort() 
    };
  }, [produtos]);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-100 font-sans antialiased text-slate-900">
      
      {/* HEADER MOBILE (Para a logo e botão de filtro no celular) */}
      <header className={`lg:hidden sticky top-0 z-[60] flex items-center justify-between p-4 shadow-xl ${temaAtivo.sidebarBg}`}>
        <div className="h-10 w-32 bg-white rounded-xl p-1.5 shadow-inner flex items-center justify-center">
          <img src={temaAtivo.logoUrl} alt="Logo" className="max-h-full max-w-full object-contain" />
        </div>
        <button 
          onClick={() => setMenuAberto(true)}
          className="px-4 py-2 rounded-xl bg-white/10 text-white font-black text-[10px] uppercase border border-white/20"
        >
          Filtros
        </button>
      </header>

      {menuAberto && <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[70] lg:hidden" onClick={() => setMenuAberto(false)} />}

      <aside className={`fixed lg:sticky top-0 z-[80] w-80 shadow-2xl h-screen p-6 flex flex-col transition-all duration-500 ${temaAtivo.sidebarBg} text-white ${menuAberto ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        
        <div className="mb-10 w-full px-2 hidden lg:block"> 
          <div className="bg-white rounded-2xl shadow-inner flex items-center justify-center w-full h-32 p-4 overflow-hidden border-2 border-white/10">
             <img src={temaAtivo.logoUrl} alt={`Logo ${marca}`} className="max-w-full max-h-full object-contain" onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/200x100?text=Sem+Logo'; }} />
          </div>
        </div>

        <Link href="/" className="mb-8 flex items-center gap-2 text-white/50 hover:text-white transition-colors font-bold text-xs uppercase tracking-widest text-white"><span>←</span> Menu Inicial</Link>

        <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar pb-10">
          <div>
            <label className="text-[10px] font-black text-white/40 uppercase mb-3 block">Fabricante</label>
            <div className="grid grid-cols-2 gap-2 bg-black/30 p-1 rounded-xl">
              <button onClick={() => { setMarca('URBA'); setMenuAberto(false); }} className={`py-2 rounded-lg text-xs font-bold transition-all ${marca === 'URBA' ? 'bg-[#00A8CC] text-white shadow-lg' : 'text-white/40'}`}>URBA</button>
              <button onClick={() => { setMarca('BROSOL'); setMenuAberto(false); }} className={`py-2 rounded-lg text-xs font-bold transition-all ${marca === 'BROSOL' ? 'bg-[#FFD700] text-[#2B3990] shadow-lg' : 'text-white/40'}`}>BROSOL</button>
            </div>
          </div>

          <div className="relative">
            <div className="flex justify-between items-center mb-2"><label className="text-[10px] font-black uppercase ml-1" style={{ color: temaAtivo.accentColor }}>Pesquisa Geral</label>{buscaGeral && <button onClick={() => limparFiltroIndividual('geral')} className="text-[9px] text-red-400 font-bold uppercase">Limpar</button>}</div>
            <input value={buscaGeral} onChange={(e) => setBuscaGeral(e.target.value)} placeholder="O que busca?" className={`w-full bg-black/20 border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:ring-2 ${temaAtivo.inputFocus}`} />
          </div>

          <div className="relative">
            <div className="flex justify-between items-center mb-2"><label className="text-[10px] font-black text-white/40 uppercase ml-1">Código</label>{busca && <button onClick={() => limparFiltroIndividual('codigo')} className="text-[9px] text-red-400 font-bold uppercase">Limpar</button>}</div>
            <input list="list-codigos" value={busca} onChange={(e) => setBusca(e.target.value.toUpperCase())} className={`w-full bg-black/20 border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:ring-2 ${temaAtivo.inputFocus}`} />
            <datalist id="list-codigos">{opcoesFiltros.codigos.map(c => <option key={c} value={c} />)}</datalist>
          </div>

          <div className="relative">
            <div className="flex justify-between items-center mb-2"><label className="text-[10px] font-black text-white/40 uppercase ml-1">Veículo</label>{filtrosSelecionados['Veículos'] && <button onClick={() => limparFiltroIndividual('Veículos')} className="text-[9px] text-red-400 font-bold uppercase">Limpar</button>}</div>
            <input list="list-veiculos" value={filtrosSelecionados['Veículos'] || ''} onChange={(e) => setFiltrosSelecionados({...filtrosSelecionados, 'Veículos': e.target.value})} className={`w-full bg-black/20 border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:ring-2 ${temaAtivo.inputFocus}`} />
            <datalist id="list-veiculos">{opcoesFiltros.veiculos.map(v => <option key={v} value={v} />)}</datalist>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {produtos.map(produto => (
                <div key={produto.id} className="bg-white rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 flex flex-col group overflow-hidden">
                  <div className="aspect-[4/3] bg-slate-50 flex items-center justify-center p-8 relative min-h-[220px]">
                    {produto.dados['Lançamento'] === 'Sim' && <span className={`absolute top-6 left-6 text-[10px] font-black px-4 py-1.5 rounded-full z-10 shadow-md uppercase tracking-wider ${temaAtivo.badge}`}>Lançamento</span>}
                    <img 
                      src={`${STORAGE_URL}/${marca.toLowerCase()}/${produto.codigo_produto.toLowerCase()}.jpg`} 
                      className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-700"
                      loading="eager"
                      onError={(e) => { e.currentTarget.src = `${STORAGE_URL}/${marca.toLowerCase()}/${produto.codigo_produto.toLowerCase()}_a.jpg`; }}
                    />
                  </div>
                  <div className="p-8 flex flex-col flex-1">
                    <span className="text-3xl font-black text-slate-900 tracking-tighter mb-1 uppercase leading-none">{produto.codigo_produto}</span>
                    <p className="text-[10px] font-black uppercase tracking-widest mb-4" style={{ color: temaAtivo.accentColor }}>{produto.dados['Grupo']}</p>
                    <p className="text-xs text-slate-400 line-clamp-3 mb-6 italic">{produto.dados['Veículos']}</p>
                    <button onClick={() => setProdutoSelecionado(produto)} className={`w-full mt-auto font-black py-4 rounded-2xl shadow-lg transition-all active:scale-95 ${temaAtivo.buttonBg} ${temaAtivo.buttonText}`}>DETALHES</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {produtoSelecionado && (
        <ModalDetalhes produto={produtoSelecionado} marca={marca} storageUrl={STORAGE_URL} onClose={() => setProdutoSelecionado(null)} temaAtivo={temaAtivo} />
      )}
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4 lg:p-8">
      <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative bg-white w-full h-full lg:h-auto lg:max-h-[95vh] lg:max-w-6xl lg:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row animate-in zoom-in-95 duration-300 border border-slate-100">
        <button onClick={onClose} className="absolute top-6 right-6 z-20 bg-slate-100 w-12 h-12 rounded-full font-bold shadow-md hover:bg-red-500 hover:text-white transition-all text-slate-900 flex items-center justify-center">✕</button>

        <div className="lg:w-1/2 bg-slate-50 p-8 flex flex-col items-center justify-center min-h-[400px] text-slate-900 relative">
          {loadingGaleria ? (
            <div className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: temaAtivo.accentColor }}></div>
          ) : (
            <>
              <div className="flex-1 flex items-center justify-center w-full">
                <img src={fotoAtiva} className="max-h-[450px] max-w-full object-contain drop-shadow-2xl animate-in fade-in duration-500" />
              </div>
              {fotos.length > 1 && (
                <div className="flex gap-3 mt-6 p-2 overflow-x-auto max-w-full custom-scrollbar">
                  {fotos.map((url, i) => (
                    <button key={i} onClick={() => setFotoAtiva(url)} className={`w-16 h-16 flex-shrink-0 rounded-xl border-2 transition-all ${fotoAtiva === url ? 'scale-105 shadow-md' : 'opacity-40'}`} style={{ borderColor: fotoAtiva === url ? temaAtivo.accentColor : 'transparent' }}>
                      <img src={url} className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        <div className="lg:w-1/2 p-10 lg:p-14 overflow-y-auto bg-white flex flex-col flex-1 text-slate-900">
          <div className="mb-10 text-slate-900">
            <span className="font-black text-xs tracking-widest uppercase mb-2 block" style={{ color: temaAtivo.accentColor }}>{marca}</span>
            <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">{produto.codigo_produto}</h2>
          </div>
          <div className="space-y-6 flex-1 text-slate-900">
            {Object.entries(produto.dados).map(([key, value]) => (
              value && !['id', 'Arquivo Foto', 'codigo_produto', 'Descrição Produto', 'Lançamento'].includes(key) && (
                <div key={key} className="border-b border-slate-50 pb-3 text-slate-900">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{key}</span>
                  <p className="text-slate-800 font-bold leading-tight mt-1">{String(value)}</p>
                </div>
              )
            ))}
          </div>
          <button onClick={onClose} className={`mt-12 w-full font-black py-5 rounded-2xl shadow-xl transition-all active:scale-95 ${temaAtivo.buttonBg} ${temaAtivo.buttonText}`}>VOLTAR</button>
        </div>
      </div>
    </div>
  );
}