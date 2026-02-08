'use client'

import { useState, useRef, useEffect } from 'react'
import { Globe } from 'lucide-react'

interface CountryEmojiPickerProps {
  onSelect: (emoji: string) => void
}

// Liste des drapeaux les plus utilisés
const COMMON_FLAGS = [
  // Europe
  { emoji: '🇫🇷', name: 'France' },
  { emoji: '🇩🇪', name: 'Allemagne' },
  { emoji: '🇮🇹', name: 'Italie' },
  { emoji: '🇪🇸', name: 'Espagne' },
  { emoji: '🇵🇹', name: 'Portugal' },
  { emoji: '🇧🇪', name: 'Belgique' },
  { emoji: '🇳🇱', name: 'Pays-Bas' },
  { emoji: '🇱🇺', name: 'Luxembourg' },
  { emoji: '🇨🇭', name: 'Suisse' },
  { emoji: '🇦🇹', name: 'Autriche' },
  { emoji: '🇬🇧', name: 'Royaume-Uni' },
  { emoji: '🇮🇪', name: 'Irlande' },
  { emoji: '🇩🇰', name: 'Danemark' },
  { emoji: '🇸🇪', name: 'Suède' },
  { emoji: '🇳🇴', name: 'Norvège' },
  { emoji: '🇫🇮', name: 'Finlande' },
  { emoji: '🇮🇸', name: 'Islande' },
  { emoji: '🇵🇱', name: 'Pologne' },
  { emoji: '🇨🇿', name: 'République tchèque' },
  { emoji: '🇸🇰', name: 'Slovaquie' },
  { emoji: '🇭🇺', name: 'Hongrie' },
  { emoji: '🇷🇴', name: 'Roumanie' },
  { emoji: '🇧🇬', name: 'Bulgarie' },
  { emoji: '🇬🇷', name: 'Grèce' },
  { emoji: '🇭🇷', name: 'Croatie' },
  { emoji: '🇸🇮', name: 'Slovénie' },
  { emoji: '🇷🇸', name: 'Serbie' },
  { emoji: '🇧🇦', name: 'Bosnie-Herzégovine' },
  { emoji: '🇲🇪', name: 'Monténégro' },
  { emoji: '🇲🇰', name: 'Macédoine du Nord' },
  { emoji: '🇦🇱', name: 'Albanie' },
  { emoji: '🇱🇻', name: 'Lettonie' },
  { emoji: '🇱🇹', name: 'Lituanie' },
  { emoji: '🇪🇪', name: 'Estonie' },
  { emoji: '🇲🇩', name: 'Moldavie' },
  { emoji: '🇺🇦', name: 'Ukraine' },
  { emoji: '🇧🇾', name: 'Biélorussie' },
  { emoji: '🇷🇺', name: 'Russie' },
  { emoji: '🇻🇦', name: 'Vatican' },

  // Afrique
  { emoji: '🇩🇿', name: 'Algérie' },
  { emoji: '🇲🇦', name: 'Maroc' },
  { emoji: '🇹🇳', name: 'Tunisie' },
  { emoji: '🇱🇾', name: 'Libye' },
  { emoji: '🇪🇬', name: 'Égypte' },
  { emoji: '🇸🇩', name: 'Soudan' },
  { emoji: '🇸🇸', name: 'Soudan du Sud' },
  { emoji: '🇪🇹', name: 'Éthiopie' },
  { emoji: '🇪🇷', name: 'Érythrée' },
  { emoji: '🇩🇯', name: 'Djibouti' },
  { emoji: '🇸🇴', name: 'Somalie' },
  { emoji: '🇰🇪', name: 'Kenya' },
  { emoji: '🇺🇬', name: 'Ouganda' },
  { emoji: '🇹🇿', name: 'Tanzanie' },
  { emoji: '🇷🇼', name: 'Rwanda' },
  { emoji: '🇧🇮', name: 'Burundi' },
  { emoji: '🇨🇩', name: 'République démocratique du Congo' },
  { emoji: '🇨🇬', name: 'République du Congo' },
  { emoji: '🇬🇦', name: 'Gabon' },
  { emoji: '🇨🇲', name: 'Cameroun' },
  { emoji: '🇳🇬', name: 'Nigéria' },
  { emoji: '🇬🇭', name: 'Ghana' },
  { emoji: '🇨🇮', name: 'Côte d’Ivoire' },
  { emoji: '🇸🇳', name: 'Sénégal' },
  { emoji: '🇲🇱', name: 'Mali' },
  { emoji: '🇳🇪', name: 'Niger' },
  { emoji: '🇧🇫', name: 'Burkina Faso' },
  { emoji: '🇹🇬', name: 'Togo' },
  { emoji: '🇧🇯', name: 'Bénin' },
  { emoji: '🇬🇲', name: 'Gambie' },
  { emoji: '🇬🇳', name: 'Guinée' },
  { emoji: '🇸🇱', name: 'Sierra Leone' },
  { emoji: '🇱🇷', name: 'Liberia' },
  { emoji: '🇨🇻', name: 'Cap-Vert' },
  { emoji: '🇲🇷', name: 'Mauritanie' },
  { emoji: '🇿🇦', name: 'Afrique du Sud' },
  { emoji: '🇳🇦', name: 'Namibie' },
  { emoji: '🇧🇼', name: 'Botswana' },
  { emoji: '🇿🇼', name: 'Zimbabwe' },
  { emoji: '🇲🇿', name: 'Mozambique' },
  { emoji: '🇿🇲', name: 'Zambie' },
  { emoji: '🇲🇼', name: 'Malawi' },
  { emoji: '🇱🇸', name: 'Lesotho' },
  { emoji: '🇸🇿', name: 'Eswatini' },
  { emoji: '🇲🇬', name: 'Madagascar' },
  { emoji: '🇨🇫', name: 'République centrafricaine' },
  { emoji: '🇸🇹', name: 'Sao Tomé-et-Principe' },
  { emoji: '🇰🇲', name: 'Comores' },
  { emoji: '🇸🇨', name: 'Seychelles' },
  { emoji: '🇲🇺', name: 'Maurice' },

  // Moyen-Orient & Asie
  { emoji: '🇸🇦', name: 'Arabie Saoudite' },
  { emoji: '🇦🇪', name: 'Émirats arabes unis' },
  { emoji: '🇶🇦', name: 'Qatar' },
  { emoji: '🇰🇼', name: 'Koweït' },
  { emoji: '🇧🇭', name: 'Bahreïn' },
  { emoji: '🇴🇲', name: 'Oman' },
  { emoji: '🇾🇪', name: 'Yémen' },
  { emoji: '🇮🇶', name: 'Irak' },
  { emoji: '🇸🇾', name: 'Syrie' },
  { emoji: '🇱🇧', name: 'Liban' },
  { emoji: '🇯🇴', name: 'Jordanie' },
  { emoji: '🇵🇸', name: 'Palestine' },
  { emoji: '🇹🇷', name: 'Turquie' },
  { emoji: '🇮🇷', name: 'Iran' },
  { emoji: '🇦🇫', name: 'Afghanistan' },
  { emoji: '🇵🇰', name: 'Pakistan' },
  { emoji: '🇮🇳', name: 'Inde' },
  { emoji: '🇧🇩', name: 'Bangladesh' },
  { emoji: '🇳🇵', name: 'Népal' },
  { emoji: '🇱🇰', name: 'Sri Lanka' },
  { emoji: '🇨🇳', name: 'Chine' },
  { emoji: '🇯🇵', name: 'Japon' },
  { emoji: '🇰🇷', name: 'Corée du Sud' },
  { emoji: '🇰🇵', name: 'Corée du Nord' },
  { emoji: '🇹🇭', name: 'Thaïlande' },
  { emoji: '🇻🇳', name: 'Viêt Nam' },
  { emoji: '🇲🇾', name: 'Malaisie' },
  { emoji: '🇮🇩', name: 'Indonésie' },
  { emoji: '🇵🇭', name: 'Philippines' },
  { emoji: '🇲🇲', name: 'Myanmar' },
  { emoji: '🇰🇭', name: 'Cambodge' },
  { emoji: '🇱🇦', name: 'Laos' },
  { emoji: '🇲🇳', name: 'Mongolie' },
  { emoji: '🇸🇬', name: 'Singapour' },

  // Amériques
  { emoji: '🇺🇸', name: 'États-Unis' },
  { emoji: '🇨🇦', name: 'Canada' },
  { emoji: '🇲🇽', name: 'Mexique' },
  { emoji: '🇧🇷', name: 'Brésil' },
  { emoji: '🇦🇷', name: 'Argentine' },
  { emoji: '🇨🇱', name: 'Chili' },
  { emoji: '🇵🇪', name: 'Pérou' },
  { emoji: '🇨🇴', name: 'Colombie' },
  { emoji: '🇻🇪', name: 'Venezuela' },
  { emoji: '🇪🇨', name: 'Équateur' },
  { emoji: '🇧🇴', name: 'Bolivie' },
  { emoji: '🇵🇾', name: 'Paraguay' },
  { emoji: '🇺🇾', name: 'Uruguay' },
  { emoji: '🇨🇺', name: 'Cuba' },
  { emoji: '🇩🇴', name: 'République dominicaine' },
  { emoji: '🇭🇹', name: 'Haïti' },
  { emoji: '🇯🇲', name: 'Jamaïque' },
  { emoji: '🇨🇷', name: 'Costa Rica' },
  { emoji: '🇵🇦', name: 'Panama' },

  // Océanie
  { emoji: '🇦🇺', name: 'Australie' },
  { emoji: '🇳🇿', name: 'Nouvelle-Zélande' },
  { emoji: '🇵🇬', name: 'Papouasie-Nouvelle-Guinée' },
  { emoji: '🇫🇯', name: 'Fidji' },
  { emoji: '🇸🇧', name: 'Îles Salomon' },
  { emoji: '🇻🇺', name: 'Vanuatu' },
  { emoji: '🇼🇸', name: 'Samoa' },
  { emoji: '🇹🇴', name: 'Tonga' }
];

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
