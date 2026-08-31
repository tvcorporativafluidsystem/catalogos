'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '../../../lib/supabase';

export default function ProdutoPage() {
  const params = useParams();
  const codigo = String(params.codigo);

  const [produto, setProduto] = useState<any>(null);

  useEffect(() => {
    async function carregar() {
      const { data } = await supabase
        .from('produtos')
        .select('*')
        .eq('codigo_produto', codigo)
        .single();

      setProduto(data);
    }

    carregar();
  }, [codigo]);

  if (!produto) {
    return <div>Carregando...</div>;
  }

  if (!produto) {
    return <div>Produto não encontrado.</div>;
  }
  
  const STORAGE_URL =
    'https://agygfdeizpfcdzxpukpx.supabase.co/storage/v1/object/public/catalog-images';
  
  const imagemUrl =
    `${STORAGE_URL}/${produto.marca.toLowerCase()}/${produto.dados['Arquivo Foto']}`;
  
  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-8">
  
        /
          ← Voltar ao Catálogo
        </a>
  
        <h1 className="text-4xl font-black mb-6">
          {produto.codigo_produto}
        </h1>
  
        <div className="flex justify-center mb-8">
          <img
               </div>
  
        <div className="space-y-4">
          {Object.entries(produto.dados).map(([campo, valor]) => {
            if (!valor || campo === 'Arquivo Foto') {
              return null;
            }
  
            return (
              <div key={campo}>
                <strong>{campo}</strong>
                <div>{String(valor)}</div>
              </div>
            );
          })}
        </div>
  
      </div>
    </main>
  );