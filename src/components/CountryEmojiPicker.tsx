'use client'

import { useState, useRef, useEffect } from 'react'
import { Globe } from 'lucide-react'

interface CountryEmojiPickerProps {
  onSelect: (emoji: string) => void
}

// Liste des drapeaux les plus utilisés
const COMMON_FLAGS = [
  { emoji: '🇫🇷', name: 'France' },
  { emoji: '🇩🇿', name: 'Algérie' },
  { emoji: '🇲🇦', name: 'Maroc' },
  { emoji: '🇹🇳', name: 'Tunisie' },
  { emoji: '🇪🇬', name: 'Égypte' },
  { emoji: '🇸🇦', name: 'Arabie Saoudite' },
  { emoji: '🇦🇪', name: 'Émirats Arabes Unis' },
  { emoji: '🇹🇷', name: 'Turquie' },
  { emoji: '🇵🇰', name: 'Pakistan' },
  { emoji: '🇮🇩', name: 'Indonésie' },
  { emoji: '🇲🇾', name: 'Malaisie' },
  { emoji: '🇮🇶', name: 'Irak' },
  { emoji: '🇸🇾', name: 'Syrie' },
  { emoji: '🇱🇧', name: 'Liban' },
  { emoji: '🇯🇴', name: 'Jordanie' },
  { emoji: '🇵🇸', name: 'Palestine' },
  { emoji: '🇾🇪', name: 'Yémen' },
  { emoji: '🇴🇲', name: 'Oman' },
  { emoji: '🇰🇼', name: 'Koweït' },
  { emoji: '🇶🇦', name: 'Qatar' },
  { emoji: '🇧🇭', name: 'Bahreïn' },
  { emoji: '🇱🇾', name: 'Libye' },
  { emoji: '🇸🇩', name: 'Soudan' },
  { emoji: '🇸🇴', name: 'Somalie' },
]

export default function CountryEmojiPicker({ onSelect }: CountryEmojiPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const pickerRef = useRef<HTMLDivElement>(null)

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const filteredFlags = searchTerm
    ? COMMON_FLAGS.filter(flag => 
        flag.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : COMMON_FLAGS

  const handleSelect = (emoji: string) => {
    onSelect(emoji)
    setIsOpen(false)
    setSearchTerm('')
  }

  return (
    <div className="relative inline-block" ref={pickerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded border border-gray-300 transition"
        title="Ajouter un drapeau"
      >
        <Globe size={18} />
        <span className="text-sm">Drapeau</span>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 left-0 bg-white border-2 border-gray-300 rounded-lg shadow-xl w-80">
          <div className="p-3 border-b border-gray-200">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher un pays..."
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              autoFocus
            />
          </div>
          
          <div className="p-3 max-h-64 overflow-y-auto">
            <div className="grid grid-cols-6 gap-2">
              {filteredFlags.map((flag) => (
                <button
                  key={flag.emoji}
                  type="button"
                  onClick={() => handleSelect(flag.emoji)}
                  className="text-3xl hover:bg-gray-100 rounded p-2 transition"
                  title={flag.name}
                >
                  {flag.emoji}
                </button>
              ))}
            </div>
            
            {filteredFlags.length === 0 && (
              <p className="text-center text-gray-500 py-4 text-sm">
                Aucun pays trouvé
              </p>
            )}
          </div>

          <div className="p-2 border-t border-gray-200 text-xs text-gray-500 text-center">
            Cliquez sur un drapeau pour l'ajouter
          </div>
        </div>
      )}
    </div>
  )
}
