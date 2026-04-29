'use client';
import { useState } from 'react';
import { processExcel } from '../lib/excel-processor';
import { supabase } from '../lib/supabase';

export default function Importador({ marca }: { marca: 'URBA' | 'BROSOL' }) {
  const [status, setStatus] = useState<'idle' | 'processando' | 'sucesso' | 'erro'>('idle');
  const [statusLogo, setStatusLogo] = useState<'idle' | 'processando' | 'sucesso' | 'erro'>('idle');

  // 1. FUNÇÃO PARA PROCESSAR O EXCEL (PRODUTOS)
  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus('processando');

    try {
      const dadosFormatados: any = await processExcel(file, marca);

      const { error } = await supabase
        .from('produtos')
        .upsert(dadosFormatados, { onConflict: 'codigo_produto, marca' });

      if (error) throw error;
      
      setStatus('sucesso');
      alert(`${dadosFormatados.length} produtos atualizados com sucesso!`);
    } catch (err) {
      console.error(err);
      setStatus('erro');
    }
  };

  // 2. NOVA FUNÇÃO PARA UPLOAD DA LOGO (PARA O STORAGE)
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatusLogo('processando');

    try {
      // Definimos o nome fixo que o Catálogo espera: urba_logo.png ou brosol_logo.png
      const fileExt = file.name.split('.').pop();
      const fileName = `${marca.toLowerCase()}_logo.${fileExt}`;
      const filePath = `logos/${fileName}`;

      // Faz o upload para o bucket 'catalog-images'
      const { error: uploadError } = await supabase.storage
        .from('catalog-images')
        .upload(filePath, file, {
          upsert: true, // Se já existir, ele substitui
          cacheControl: '3600'
        });

      if (uploadError) throw uploadError;

      setStatusLogo('sucesso');
      alert(`Logo da ${marca} atualizada com sucesso!`);
    } catch (err) {
      console.error('Erro no upload da logo:', err);
      setStatusLogo('erro');
      alert('Erro ao enviar a logo.');
    }
  };

  return (
    <div className="space-y-8">
      {/* SEÇÃO DA PLANILHA */}
      <div className="p-6 border rounded-3xl bg-white shadow-sm border-slate-100">
        <h2 className="text-xl font-black mb-4 uppercase tracking-tighter text-slate-800">
          Planilha de Produtos ({marca})
        </h2>
        <input 
          type="file" 
          accept=".xlsx, .xls" 
          onChange={handleFile}
          disabled={status === 'processando'}
          className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all cursor-pointer"
        />
        {status === 'processando' && <p className="mt-4 text-orange-500 font-bold animate-pulse text-sm">Processando Excel...</p>}
        {status === 'sucesso' && <p className="mt-4 text-green-600 font-bold text-sm">✓ Produtos importados!</p>}
      </div>

      {/* SEÇÃO DA LOGO - ONDE VOCÊ CORRIGE O PROBLEMA */}
      <div className="p-6 border rounded-3xl bg-slate-50 shadow-sm border-slate-200">
        <h2 className="text-xl font-black mb-4 uppercase tracking-tighter text-slate-800">
          Logo Oficial ({marca})
        </h2>
        <p className="text-xs text-slate-500 mb-4 font-medium italic">
          * Formato sugerido: PNG transparente. O nome será padronizado automaticamente.
        </p>
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleLogoUpload}
          disabled={statusLogo === 'processando'}
          className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-slate-200 file:text-slate-700 hover:file:bg-slate-300 transition-all cursor-pointer"
        />
        {statusLogo === 'processando' && <p className="mt-4 text-blue-500 font-bold animate-pulse text-sm">Enviando imagem para o storage...</p>}
        {statusLogo === 'sucesso' && <p className="mt-4 text-green-600 font-bold text-sm">✓ Logo {marca} atualizada!</p>}
        {statusLogo === 'erro' && <p className="mt-4 text-red-600 font-bold text-sm">Erro ao enviar logo.</p>}
      </div>
    </div>
  );
}