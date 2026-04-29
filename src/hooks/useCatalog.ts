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
    
    // 1. Iniciamos a query básica
    let query = supabase.from('produtos').select('*').eq('marca', marca);

    // 2. Filtro de Código (Barra lateral)
    if (termo && termo.trim() !== '') {
      query = query.ilike('codigo_produto', `%${termo.trim()}%`);
    }

    // 3. Filtros Dinâmicos (Grupo, etc)
    Object.entries(filtrosAtivos).forEach(([key, value]) => {
      if (value && typeof value === 'string' && value.trim() !== '') {
        query = query.ilike(`dados->>${key}`, `%${value.trim()}%`);
      }
    });

    // 4. PESQUISA GERAL (Busca em profundidade no JSON)
    if (buscaGeral && buscaGeral.trim() !== '') {
      const t = buscaGeral.trim();
      // Adicionamos "Números Referência" na busca geral como você pediu
      query = query.or(`codigo_produto.ilike.%${t}%, dados->>Veículos.ilike.%${t}%, dados->>Grupo.ilike.%${t}%, dados->>Números Referência.ilike.%${t}%`);
    }

    query = query.order('codigo_produto', { ascending: true });

    // CORREÇÃO CRÍTICA: Aumentamos o limite para 1000 ou removemos o range baixo
    // Para catálogos, 1000 itens costumam cobrir toda a linha sem travar o browser
    const { data, error } = await query.limit(1000); 
    
    if (error) {
      console.error('Erro na busca:', error.message);
    } else {
      setProdutos(data || []);
    }
    
    setLoading(false);
  };

  return { produtos, loading, filtrosDisponiveis, buscar };
}