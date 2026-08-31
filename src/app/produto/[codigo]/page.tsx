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
    return <div>Carregando