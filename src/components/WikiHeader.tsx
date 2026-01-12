'use client'

import Link from 'next/link'
import Image from 'next/image'
import SearchBar from './SearchBar'
import UserMenu from './UserMenu'

export default function WikiHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-300 shadow-sm">
      <div className="max-w-[1400px] mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3">
              <Image 
                src="/logo.png" 
                alt="MuslimWiki Logo" 
                width={40} 
                height={40}
                className="object-contain"
              />
              <div className="text-2xl font-bold font-serif text-primary">MuslimWiki</div>
            </Link>
            
            <nav className="hidden md:flex gap-6 text-sm">
              <Link href="/" className="hover:text-primary">
                Page d'accueil
              </Link>
              <Link href="/wiki/Grande_Mosquée_de_Paris" className="hover:text-primary">
                Contenu
              </Link>
              <button className="hover:text-primary">Article aléatoire</button>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <SearchBar />
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  )
}
