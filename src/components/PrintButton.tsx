'use client'

import { Printer } from 'lucide-react'

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-500 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors border border-gray-200"
      title="Imprimer l'article"
    >
      <Printer size={14} />
      <span>Imprimer</span>
    </button>
  )
}
