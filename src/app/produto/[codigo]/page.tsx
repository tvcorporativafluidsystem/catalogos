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
      const { data } = await supabase
        .from('produtos')
        .select('*')
        .eq('codigo_produto', codigo)
        .single();

      setProduto(data);
      setLoading(false);
    }

    carregarProduto();
  }, [codigo]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!produto) {
    return <div>Produto não encontrado.</div>;
  }

return (
  <main className="min-h-screen bg-slate-100 p-6">
    <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-8">

      /
        ← Voltar ao Catálogo
      </a>

      <h1 className="text-4xl font-black mb-6">
        {produto.codigo_produto}
      </h1>

      <div className="space-y-4">
        {Object.entries(produto.dados).map(([campo, valor]) => {
          if (!valor) return null;

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
