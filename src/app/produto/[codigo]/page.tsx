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

return ( <div className="min-h-screen bg-slate-100 p-6"> <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl p-8">

    <a
      href="/catalogo"
      className="inline-block mb-6 text-slate-600 hover:text-slate-900 font-semibold"
    >
      ← Voltar ao Catálogo
    </a>

    <h1 className="text-5xl font-black mb-8">
      {produto.codigo_produto}
    </h1>

    <div className="space-y-5">
      {Object.entries(produto.dados).map(([campo, valor]) => {
        if (!valor) return null;

        if (
          campo === 'Grupo Inglês' ||
          campo === 'Grupo Espanhol' ||
          campo === 'Descrição Inglês' ||
          campo === 'Descrição Espanhol' ||
          campo === 'Arquivo Foto'
        ) {
          return null;
        }

        return (
          <div
            key={campo}
            className="border-b border-slate-200 pb-3"
          >
            <div className="text-xs uppercase font-black text-slate-500">
              {campo}
            </div>

            <div className="text-slate-900 font-semibold whitespace-pre-line">
              {String(valor)}
            </div>
          </div>
        );
      })}
    </div>

  </div>
</div>
);
}
