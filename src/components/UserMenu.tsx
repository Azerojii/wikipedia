'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Plus, User, ChevronDown } from 'lucide-react'

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all text-sm"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <User size={16} />
        <span className="hidden md:inline font-medium">Menu</span>
        <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50" role="menu">
          <div className="p-1.5">
            <Link
              href="/submit"
              className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors rounded-lg group"
              onClick={() => setIsOpen(false)}
              role="menuitem"
            >
              <div className="p-1.5 bg-primary/10 rounded-lg group-hover:bg-primary/15 transition-colors">
                <Plus size={16} className="text-primary" />
              </div>
              <div>
                <div className="font-medium text-sm text-gray-800">Soumettre un article</div>
                <div className="text-xs text-gray-400">Proposer un nouvel article</div>
              </div>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
