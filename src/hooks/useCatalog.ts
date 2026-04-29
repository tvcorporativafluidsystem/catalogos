import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useCatalog(marca: string) {
  const [produtos, setProdutos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtrosDisponiveis, setFiltrosDisponiveis] = useState<string[]>([]);

  useEffect(() => {
    async function fetchSchema() {
      const { data } = await supabase
        .from('produtos')
        .select('dados')
        .eq('marca', marca)
        .limit(1);
  
      if (data && data[0]?.dados) {
        const colunas = Object.keys(data[0].dados);
        const ignorar = ['Arquivo Foto', 'Veículos', 'Números Referência', 'Observação', 'Lançamento', 'Descrição Produto'];
        const filtrosValidos = colunas.filter(c => !ignorar.includes(c));
        setFiltrosDisponiveis(filtrosValidos);
      }
    }
    fetchSchema();
  }, [marca]);

  const buscar = async (termo: string, filtrosAtivos: any, buscaGeral?: string) => {
    setLoading(true);
    
    // 1. Iniciamos a query selecionando os dados da marca
    let query = supabase.from('produtos').select('*').eq('marca', marca);

    // 2. APLICAÇÃO DOS FILTROS LATERAIS (Código, Veículo, Grupo)
    if (termo && termo.trim() !== '') {
      query = query.ilike('codigo_produto', `%${termo.trim()}%`);
    }

    Object.entries(filtrosAtivos).forEach(([key, value]) => {
      if (value && typeof value === 'string' && value.trim() !== '') {
        query = query.ilike(`dados->>${key}`, `%${value.trim()}%`);
      }
    });

    // 3. PESQUISA GERAL (Otimizada para JSONB)
    if (buscaGeral && buscaGeral.trim() !== '') {
      const t = buscaGeral.trim();
      
      /* MUDANÇA CRÍTICA: 
         Em vez de usar dados::text (que pode ser bloqueado), 
         vamos usar o operador @> ou pesquisar especificamente nas colunas 
         mais comuns de texto dentro do JSON.
      */
      query = query.or(`codigo_produto.ilike.%${t}%, dados->>Veículos.ilike.%${t}%, dados->>Grupo.ilike.%${t}%, dados->>Descrição Produto.ilike.%${t}%`);
    }

    query = query.order('codigo_produto', { ascending: true });

    const { data, error } = await query.range(0, 100);
    
    if (error) {
      console.error('Erro na busca:', error.message);
      
      // FALLBACK: Se o erro for de sintaxe no .or(), tentamos uma busca mais simples
      if (error.message.includes('operator does not exist')) {
         const { data: fallbackData } = await supabase
          .from('produtos')
          .select('*')
          .eq('marca', marca)
          .ilike('codigo_produto', `%${buscaGeral}%`)
          .limit(100);
         setProdutos(fallbackData || []);
      }
    } else {
      setProdutos(data || []);
    }
    
    setLoading(false);
  };

  return { produtos, loading, filtrosDisponiveis, buscar };
}