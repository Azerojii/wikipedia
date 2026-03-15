'use client'

import Link from 'next/link'
import { Menu, BookOpen, List, Star, Clock } from 'lucide-react'

export default function WikiSidebar() {
  return (
    <aside className="w-52 flex-shrink-0 bg-white border-r border-gray-100 px-4 py-6 hidden lg:block">
      <nav className="space-y-5" aria-label="Barre latérale">
        <div>
          <h3 className="text-[11px] font-bold uppercase text-gray-400 tracking-wider mb-2">Navigation</h3>
          <ul className="space-y-1 text-sm">
            <li>
              <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary/80 hover:bg-gray-50 rounded-md px-2 py-1.5 -mx-2 transition-colors">
                <BookOpen size={15} />
                Page d'accueil
              </Link>
            </li>
          </ul>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <h3 className="text-[11px] font-bold uppercase text-gray-400 tracking-wider mb-2">Catégories</h3>
          <ul className="space-y-1 text-sm">
            <li>
              <Link href="/category/Histoire" className="text-primary hover:text-primary/80 hover:bg-gray-50 rounded-md px-2 py-1 -mx-2 block transition-colors">
                Histoire
              </Link>
            </li>
            <li>
              <Link href="/category/Architecture" className="text-primary hover:text-primary/80 hover:bg-gray-50 rounded-md px-2 py-1 -mx-2 block transition-colors">
                Architecture
              </Link>
            </li>
            <li>
              <Link href="/category/Culture" className="text-primary hover:text-primary/80 hover:bg-gray-50 rounded-md px-2 py-1 -mx-2 block transition-colors">
                Culture
              </Link>
            </li>
            <li>
              <Link href="/category/Religion" className="text-primary hover:text-primary/80 hover:bg-gray-50 rounded-md px-2 py-1 -mx-2 block transition-colors">
                Religion
              </Link>
            </li>
            <li>
              <Link href="/category/Général" className="text-primary hover:text-primary/80 hover:bg-gray-50 rounded-md px-2 py-1 -mx-2 block transition-colors">
                Général
              </Link>
            </li>
            <li>
              <Link href="/category/Personnalités" className="text-primary hover:text-primary/80 hover:bg-gray-50 rounded-md px-2 py-1 -mx-2 block transition-colors">
                Personnalités
              </Link>
            </li>
          </ul>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <h3 className="text-[11px] font-bold uppercase text-gray-400 tracking-wider mb-2">Outils</h3>
          <ul className="space-y-1 text-sm">
            <li>
              <Link href="/submit" className="text-gray-600 hover:text-primary hover:bg-gray-50 rounded-md px-2 py-1 -mx-2 block transition-colors">
                Soumettre un article
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </aside>
  )
}
