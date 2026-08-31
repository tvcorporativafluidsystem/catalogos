'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '../../../lib/supabase';

export default function ProdutoPage() {
  const params = useParams();
  const codigo = String(params.codigo);

  const [produto, setProduto] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarProduto() {
      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .eq('codigo_produto', codigo)
        .single();

      if (!error) {
        setProduto(data);
      }

      setLoading(false);
    }

    carregarProduto();
  }, [codigo]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Carregando...</p>
      </main>
    );
  }

  if (!produto) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Produto não encontrado.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-8">
  
        <a
          href="/catalogo"
          className="inline-block mb-6 px-4 py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-700 transition"
  1>
  
        <div className="flex justify-center mb-8">
          <img
            src={`https://agygfdeizpfcdzxpukpx.supabase.co/storage/v1/object/public/catalog-images/${produto.marca.toLowerCase()}/${produto.codigo_     </div>
  
        <div className="space-y-4">
          {Object.entries(produto.dados).map(([campo, valor]) => {
            if (
              !valor ||
              [
                'Arquivo Foto',
                'Descrição Inglês',
                'Descrição Espanhol',
                'Grupo Inglês',
                'Grupo Espanhol'
              ].includes(campo)
            ) {
              return null;
            }
  
            return (
              <div
                key={campo}
                className="border-b border-slate-200 pb-3"
              >
                <div className="text-xs font-bold uppercase text-slate-400">
                  {campo}
                </div>
  
                <div className="mt-1 text-slate-800">
                  {String(valor)}
                </div>
              </div>
            );
          })}
        </div>
  
      </div>
    </main>
  );