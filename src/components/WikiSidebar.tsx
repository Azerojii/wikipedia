'use client'

import Link from 'next/link'
import { Menu, BookOpen, List, Star, Clock } from 'lucide-react'

export default function WikiSidebar() {
  return (
    <aside className="w-48 flex-shrink-0 bg-wiki-bg border-r border-gray-200 px-4 py-6 hidden lg:block">
      <nav className="space-y-4">
        <div>
          <h3 className="text-xs font-bold uppercase text-gray-500 mb-2">Navigation</h3>
          <ul className="space-y-1 text-sm">
            <li>
              <Link href="/" className="flex items-center gap-2 text-primary hover:underline">
                <BookOpen size={16} />
                Page d'accueil
              </Link>
            </li>
            <li>
              <Link href="/wiki/Grande_Mosquée_de_Paris" className="flex items-center gap-2 text-primary hover:underline">
                <List size={16} />
                Contenu
              </Link>
            </li>
            <li>
              <button className="flex items-center gap-2 text-primary hover:underline">
                <Star size={16} />
                Contenu en vedette
              </button>
            </li>
            <li>
              <button className="flex items-center gap-2 text-primary hover:underline">
                <Clock size={16} />
                Modifications récentes
              </button>
            </li>
          </ul>
        </div>

        <div className="pt-4 border-t border-gray-300">
          <h3 className="text-xs font-bold uppercase text-gray-500 mb-2">Catégories</h3>
          <ul className="space-y-1 text-sm">
            <li>
              <Link href="#" className="text-primary hover:underline">
                Histoire
              </Link>
            </li>
            <li>
              <Link href="#" className="text-primary hover:underline">
                Architecture
              </Link>
            </li>
            <li>
              <Link href="#" className="text-primary hover:underline">
                Culture
              </Link>
            </li>
            <li>
              <Link href="#" className="text-primary hover:underline">
                Religion
              </Link>
            </li>
            <li>
              <Link href="#" className="text-primary hover:underline">
                Événements
              </Link>
            </li>
          </ul>
        </div>

        <div className="pt-4 border-t border-gray-300">
          <h3 className="text-xs font-bold uppercase text-gray-500 mb-2">Outils</h3>
          <ul className="space-y-1 text-sm">
            <li>
              <button className="text-gray-700 hover:text-primary">Pages liées</button>
            </li>
            <li>
              <button className="text-gray-700 hover:text-primary">Modifications liées</button>
            </li>
            <li>
              <button className="text-gray-700 hover:text-primary">Lien permanent</button>
            </li>
            <li>
              <button className="text-gray-700 hover:text-primary">Informations sur la page</button>
            </li>
          </ul>
        </div>
      </nav>
    </aside>
  )
}
