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
    const STORAGE_URL =
    'https://agygfdeizpfcdzxpukpx.supabase.co/storage/v1/object/public/catalog-images';
  
  const imagemUrl =
    `${STORAGE_URL}/urba/${produto.dados['Arquivo Foto']}`;
  
  return (
    <div>
      <h1>{produto.codigo_produto}</h1>
  
      {imagemUrl}
  
      <pre>
        {JSON.stringify(produto.dados, null, 2)}
      </pre>
    </div>
  );
