'use client';
import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function UploadFotos({ marca }: { marca: 'URBA' | 'BROSOL' }) {
  const [uploading, setUploading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setLogs([]);
    const pasta = marca.toLowerCase();

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // AJUSTE 1: Padronização total para minúsculas
      // Isso resolve o problema de arquivos vindo como .JPG, .png ou CódigoMaiusculo.jpg
      const nomeOriginal = file.name;
      const nomeFormatado = nomeOriginal.toLowerCase();
      
      const filePath = `${pasta}/${nomeFormatado}`;

      const { error } = await supabase.storage
        .from('catalog-images')
        .upload(filePath, file, {
          upsert: true 
        });

      if (error) {
        setLogs(prev => [...prev, `❌ Erro: ${nomeOriginal} -> ${error.message}`]);
      } else {
        setLogs(prev => [...prev, `✅ ${nomeOriginal} enviado como ${nomeFormatado}`]);
      }
    }
    setUploading(false);
    
    // Limpa o input para permitir subir os mesmos arquivos novamente se necessário
    e.target.value = '';
  };

  return (
    <div className="space-y-4">
      <div className="relative group">
        <input 
          type="file" 
          multiple 
          accept="image/jpeg,image/png"
          onChange={handleUpload}
          disabled={uploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
        />
        <div className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
          uploading ? 'border-slate-200 bg-slate-50' : 'border-slate-300 bg-white group-hover:border-blue-500 group-hover:bg-blue-50'
        }`}>
          <div className="text-3xl mb-2">{uploading ? '⏳' : '📸'}</div>
          <p className="text-slate-600 font-bold">
            {uploading ? 'Processando Galeria...' : 'Selecionar Fotos'}
          </p>
          <p className="text-[10px] text-slate-400 mt-2 uppercase tracking-widest font-black">
            O sistema converterá os nomes para minúsculas automaticamente
          </p>
        </div>
      </div>

      {logs.length > 0 && (
        <div className="bg-slate-900 rounded-xl p-4 max-h-48 overflow-y-auto font-mono text-[10px] shadow-inner">
          <div className="flex justify-between mb-2 border-b border-slate-800 pb-1">
            <span className="text-slate-500 uppercase">Log de Upload</span>
            <span className="text-blue-400">{marca}</span>
          </div>
          {logs.map((log, i) => (
            <p key={i} className={`py-0.5 ${log.includes('✅') ? 'text-green-400' : 'text-red-400'}`}>
              {log}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}