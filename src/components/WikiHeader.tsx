'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import SearchBar from './SearchBar'
import UserMenu from './UserMenu'

export default function WikiHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-gray-200 border-b border-gray-300 shadow-sm">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 md:gap-8">
            <Link href="/" className="flex items-center gap-2 md:gap-3">
              <Image
                src="/logo.png"
                alt="Musulmans Français Logo"
                width={36}
                height={36}
                className="object-contain"
              />
              <div className="text-lg md:text-2xl font-bold font-serif text-primary">Musulmans Français</div>
            </Link>

            <nav className="hidden md:flex gap-6 text-sm">
              <Link href="/" className="hover:text-primary transition-colors">
                Page d'accueil
              </Link>
              <Link href="/submit" className="hover:text-primary transition-colors font-medium">
                Soumettre
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden sm:block">
              <SearchBar className="w-40 md:w-64" />
            </div>
            <UserMenu />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded hover:bg-gray-300 transition-colors"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-100 border-t border-gray-300 px-4 py-3 space-y-3">
          <SearchBar className="w-full" />
          <nav className="flex flex-col gap-2 text-sm">
            <Link
              href="/"
              className="hover:text-primary transition-colors py-1"
              onClick={() => setMobileMenuOpen(false)}
            >
              Page d'accueil
            </Link>
            <Link
              href="/submit"
              className="hover:text-primary transition-colors font-medium py-1"
              onClick={() => setMobileMenuOpen(false)}
            >
              Soumettre
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
