'use client'

import { Plus, X } from 'lucide-react'
import type { MosqueData } from '@/types/mosque'

interface MosqueFormProps {
  mosqueData: MosqueData
  onChange: (data: MosqueData) => void
}

export default function MosqueForm({ mosqueData, onChange }: MosqueFormProps) {
  const update = (field: keyof MosqueData, value: unknown) => {
    onChange({ ...mosqueData, [field]: value })
  }

  const addFacility = () => {
    onChange({ ...mosqueData, facilities: [...(mosqueData.facilities || []), ''] })
  }

  const updateFacility = (idx: number, value: string) => {
    const updated = [...(mosqueData.facilities || [])]
    updated[idx] = value
    onChange({ ...mosqueData, facilities: updated })
  }

  const removeFacility = (idx: number) => {
    onChange({ ...mosqueData, facilities: (mosqueData.facilities || []).filter((_, i) => i !== idx) })
  }

  const addGalleryImage = () => {
    onChange({ ...mosqueData, gallery: [...(mosqueData.gallery || []), { src: '', caption: '' }] })
  }

  const updateGalleryImage = (idx: number, field: 'src' | 'caption', value: string) => {
    const updated = [...(mosqueData.gallery || [])]
    updated[idx] = { ...updated[idx], [field]: value }
    onChange({ ...mosqueData, gallery: updated })
  }

  const removeGalleryImage = (idx: number) => {
    onChange({ ...mosqueData, gallery: (mosqueData.gallery || []).filter((_, i) => i !== idx) })
  }

  return (
    <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 space-y-4">
      <div>
        <label className="block text-sm font-bold mb-2">Données Mosquée</label>
        <p className="text-xs text-gray-600 mb-4">
          Ces champs s'affichent dans l'infobox spécifique aux mosquées.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium mb-1">Nom affiché dans l'infobox</label>
          <input
            type="text"
            value={mosqueData.name || ''}
            onChange={(e) => update('name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            placeholder="Nom de la mosquée"
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Couleur de l'en-tête</label>
          <input
            type="color"
            value={mosqueData.headerColor || '#067782'}
            onChange={(e) => update('headerColor', e.target.value)}
            className="w-full h-10 border border-gray-300 rounded"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium mb-1">Image principale (URL)</label>
          <input
            type="text"
            value={mosqueData.image?.src || ''}
            onChange={(e) => update('image', { src: e.target.value, caption: mosqueData.image?.caption || '' })}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            placeholder="https://..."
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Légende de l'image</label>
          <input
            type="text"
            value={mosqueData.image?.caption || ''}
            onChange={(e) => update('image', { src: mosqueData.image?.src || '', caption: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            placeholder="Légende..."
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium mb-1">Localisation</label>
        <input
          type="text"
          value={mosqueData.localisation || ''}
          onChange={(e) => update('localisation', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          placeholder="Paris, France"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium mb-1">Date de construction</label>
          <input
            type="text"
            value={mosqueData.constructionDate || ''}
            onChange={(e) => update('constructionDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            placeholder="1922"
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Date d'inauguration</label>
          <input
            type="text"
            value={mosqueData.inaugurationDate || ''}
            onChange={(e) => update('inaugurationDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            placeholder="1926"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium mb-1">Capacité (fidèles)</label>
          <input
            type="number"
            value={mosqueData.capacity || ''}
            onChange={(e) => update('capacity', e.target.value ? Number(e.target.value) : undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            placeholder="1000"
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Surface salle de prière (m²)</label>
          <input
            type="number"
            value={mosqueData.prayerHallArea || ''}
            onChange={(e) => update('prayerHallArea', e.target.value ? Number(e.target.value) : undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            placeholder="500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Surface totale (m²)</label>
          <input
            type="number"
            value={mosqueData.totalArea || ''}
            onChange={(e) => update('totalArea', e.target.value ? Number(e.target.value) : undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            placeholder="1000"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium mb-1">Hauteur minaret (m)</label>
          <input
            type="number"
            value={mosqueData.minaretHeight || ''}
            onChange={(e) => update('minaretHeight', e.target.value ? Number(e.target.value) : undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            placeholder="26"
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Architecte</label>
          <input
            type="text"
            value={mosqueData.architect || ''}
            onChange={(e) => update('architect', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            placeholder="Nom de l'architecte"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium mb-1">Fondateur(s)</label>
        <input
          type="text"
          value={mosqueData.founders || ''}
          onChange={(e) => update('founders', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          placeholder="Nom du ou des fondateurs"
        />
      </div>

      {/* Facilities */}
      <div>
        <label className="block text-xs font-medium mb-2">Équipements</label>
        <div className="space-y-2">
          {(mosqueData.facilities || []).map((facility, idx) => (
            <div key={idx} className="flex gap-2">
              <input
                type="text"
                value={facility}
                onChange={(e) => updateFacility(idx, e.target.value)}
                className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-sm"
                placeholder="ex: Bibliothèque, École coranique..."
              />
              <button
                type="button"
                onClick={() => removeFacility(idx)}
                className="px-2 py-1.5 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
              >
                <X size={12} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addFacility}
            className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 hover:bg-blue-200 rounded text-xs"
          >
            <Plus size={12} />
            Ajouter un équipement
          </button>
        </div>
      </div>

      {/* Gallery */}
      <div>
        <label className="block text-xs font-medium mb-2">Galerie de photos</label>
        <div className="space-y-2">
          {(mosqueData.gallery || []).map((img, idx) => (
            <div key={idx} className="flex gap-2 items-start">
              <input
                type="text"
                value={img.src}
                onChange={(e) => updateGalleryImage(idx, 'src', e.target.value)}
                className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-sm"
                placeholder="URL de l'image"
              />
              <input
                type="text"
                value={img.caption}
                onChange={(e) => updateGalleryImage(idx, 'caption', e.target.value)}
                className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-sm"
                placeholder="Légende"
              />
              <button
                type="button"
                onClick={() => removeGalleryImage(idx)}
                className="px-2 py-1.5 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
              >
                <X size={12} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addGalleryImage}
            className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 hover:bg-blue-200 rounded text-xs"
          >
            <Plus size={12} />
            Ajouter une photo à la galerie
          </button>
        </div>
      </div>
    </div>
  )
}
