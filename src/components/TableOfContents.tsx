'use client'

import { TocItem } from '@/lib/wiki'
import Link from 'next/link'

interface TableOfContentsProps {
  items: TocItem[]
}

export default function TableOfContents({ items }: TableOfContentsProps) {
  if (items.length === 0) return null

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4 mt-4">
      <h2 className="text-sm font-bold mb-2.5 pb-2 border-b border-gray-200 text-gray-700">Sommaire</h2>
      <nav aria-label="Table des matières">
        <ul className="space-y-0.5 text-sm">
          {items.map((item, index) => (
            <li key={index} className={item.level === 3 ? 'ml-4' : ''}>
              <a
                href={`#${item.slug}`}
                className="text-primary hover:text-primary/70 hover:bg-gray-100 block py-1 px-2 -mx-2 rounded transition-colors text-[13px]"
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
