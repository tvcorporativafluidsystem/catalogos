'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '../../../lib/supabase';

const STORAGE_URL = 'https://agygfdeizpfcdzxpukpx.supabase.co/storage/v1/object/public/catalog-images';

export default function ProdutoPage() {
  const params = useParams();
  const codigo = String(params.codigo);

  const [produto, setProduto] = useState<any>(null);
  const [fotos, setFotos] = useState<string[]>([]);
  const [fotoAtiva, setFotoAtiva] = useState<string>('');
  const [carregandoFotos, setCarregandoFotos] = useState(true);

  useEffect(() => {
    async function carregar() {
      const { data } = await supabase
        .from('produtos')
        .select('*')
        .eq('codigo_produto', codigo)
        .single();

      if (data) {
        setProduto(data);

        // Identifica a marca pelo prefixo do código do produto
        const codUpper = String(codigo).toUpperCase();
        let marca = 'urba';
        if (codUpper.startsWith('UB') || codUpper.startsWith('BO')) {
          marca = 'urba';
        } else if (codUpper.startsWith('UR')) {
          marca = 'brosol';
        } else if (data.dados && data.dados['Marca']) {
          marca = String(data.dados['Marca']).toLowerCase();
        }

        // Busca todas as variações de fotos disponíveis no Storage
        const codLower = codigo.toLowerCase();
        const caminhos = ['', '_a', '_b', '_c', '_d', '_e', '_f', '_g', '_h', '_i', '_j'].map(
          (sufixo) => `${STORAGE_URL}/${marca}/${codLower}${sufixo}.jpg`
        );

        const resultados = await Promise.all(
          caminhos.map((url) =>
            fetch(url, { method: 'HEAD' })
              .then((res) => (res.ok ? url : null))
              .catch(() => null)
          )
        );

        const encontradas = resultados.filter((u): u is string => u !== null);
        const listaFinal = encontradas.length > 0 ? encontradas : ['https://via.placeholder.com/400x300?text=Sem+Imagem'];
        
        setFotos(listaFinal);
        setFotoAtiva(listaFinal[0]);
      }
      setCarregandoFotos(false);
    }

    carregar();
  }, [codigo]);

  if (!produto) {
    return <div className="min-h-screen bg-slate-100 flex items-center justify-center font-bold text-slate-500">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6 font-sans">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        
        {/* Botão Voltar */}
        <div className="p-6 pb-0">
          <a
            href="/catalogo"
            className="inline-block text-slate-600 hover:text-slate-900 font-semibold transition-colors"
          >
            ← Voltar ao Catálogo
          </a>
        </div>

        <div className="flex flex-col md:flex-row p-6 md:p-8 gap-8">
          {/* Seção de Imagem / Galeria */}
          <div className="w-full md:w-1/2 flex flex-col items-center justify-center bg-slate-50 p-6 rounded-2xl border border-slate-100">
            {carregandoFotos ? (
              <div className="h-64 flex items-center justify-center text-slate-400 font-bold">Buscando imagens...</div>
            ) : (
              <>
                <div className="w-full aspect-[4/3] flex items-center justify-center mb-4">
                  <img
                    src={fotoAtiva}
                    alt={produto.codigo_produto}
                    className="max-h-full max-w-full object-contain drop-shadow-md select-none"
                  />
                </div>

                {/* Thumbnails */}
                {fotos.length > 1 && (
                  <div className="flex flex-nowrap gap-3 overflow-x-auto w-full p-2 custom-scrollbar justify-start sm:justify-center">
                    {fotos.map((url, i) => (
                      <button
                        key={i}
                        onClick={() => setFotoAtiva(url)}
                        className={`w-14 h-14 flex-shrink-0 rounded-xl border-2 transition-all p-1 bg-white ${
                          fotoAtiva === url ? 'scale-105 border-slate-900 shadow-md' : 'opacity-40 border-transparent'
                        }`}
                      >
                        <img src={url} className="w-full h-full object-contain rounded-lg pointer-events-none" alt="Miniatura" />
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Detalhes do Produto */}
          <div className="w-full md:w-1/2 flex flex-col">
            <h1 className="text-4xl sm:text-5xl font-black mb-6 uppercase tracking-tighter text-slate-900">
              {produto.codigo_produto}
            </h1>

            <div className="space-y-4 flex-1">
              {Object.entries(produto.dados).map(([campo, valor]) => {
                if (
                  !valor ||
                  campo === 'id' ||
                  campo === 'codigo_produto' ||
                  campo === 'Grupo Inglês' ||
                  campo === 'Grupo Espanhol' ||
                  campo === 'Descrição Inglês' ||
                  campo === 'Descrição Espanhol' ||
                  campo === 'Arquivo Foto' ||
                  campo === 'Lançamento'
                ) {
                  return null;
                }

                return (
                  <div key={campo} className="border-b border-slate-100 pb-3">
                    <div className="text-[10px] uppercase font-black tracking-widest text-slate-400">
                      {campo}
                    </div>

                    <div className="text-slate-800 font-bold whitespace-pre-line leading-snug mt-0.5">
                      {String(valor)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}