'use client';

import Importador from '../../components/Importador';
import UploadFotos from '../../components/UploadFotos';
import Link from 'next/link';

export default function ImportarPage() {
  return (
    <div className="min-h-screen bg-slate-100 p-8 text-slate-900">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Painel de Controle</h1>
            <p className="text-slate-500 font-medium">Gerencie dados e galeria de fotos</p>
          </div>
          <Link href="/" className="px-6 py-3 bg-white shadow-sm border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all">
            ← VOLTAR
          </Link>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* SEÇÃO URBA */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-blue-100">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-3 h-3 bg-blue-600 rounded-full"></span>
                <h2 className="text-xl font-black text-slate-800 uppercase">Linha URBA</h2>
              </div>
              
              <div className="space-y-8">
                <section>
                  <label className="text-[10px] font-black text-slate-400 uppercase mb-3 block">1. Dados (Excel)</label>
                  <Importador marca="URBA" />
                </section>

                <section>
                  <label className="text-[10px] font-black text-slate-400 uppercase mb-3 block">2. Galeria de Fotos</label>
                  <UploadFotos marca="URBA" />
                </section>
              </div>
            </div>
          </div>

          {/* SEÇÃO BROSOL */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-green-100">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                <h2 className="text-xl font-black text-slate-800 uppercase">Linha BROSOL</h2>
              </div>

              <div className="space-y-8">
                <section>
                  <label className="text-[10px] font-black text-slate-400 uppercase mb-3 block">1. Dados (Excel)</label>
                  <Importador marca="BROSOL" />
                </section>

                <section>
                  <label className="text-[10px] font-black text-slate-400 uppercase mb-3 block">2. Galeria de Fotos</label>
                  <UploadFotos marca="BROSOL" />
                </section>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}