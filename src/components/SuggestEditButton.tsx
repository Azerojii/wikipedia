'use client'

import Link from 'next/link'
import { Pencil } from 'lucide-react'

interface SuggestEditButtonProps {
  slug: string
  articleTitle: string
  currentContent: string
}

export default function SuggestEditButton({ slug }: SuggestEditButtonProps) {
  return (
    <Link
      href={`/wiki/${slug}/suggest-edit`}
      className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-primary hover:bg-primary/5 rounded transition-colors border border-gray-300"
    >
      <Pencil size={14} />
      <span>Suggérer une modification</span>
    </Link>
  )
}
