'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function ProdutoPage() {
  const params = useParams();

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center p-8">
      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-xl w-full text-center">

        <h1 className="text-5xl font-black text-slate-900 mb-4">
          {params.codigo}
        </h1>

        <p className="text-slate-500 mb-8">
          Produto acessado por QR Code ou compartilhamento.
        </p>

        /catalogo
          Abrir Catálogo
        </Link>

      </div>
    </main>
  );
}