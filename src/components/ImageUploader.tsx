'use client'

import { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon, Link as LinkIcon } from 'lucide-react'

interface ImageUploaderProps {
  onImageInsert: (markdown: string) => void
}

export default function ImageUploader({ onImageInsert }: ImageUploaderProps) {
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [altText, setAltText] = useState('')
  const [caption, setCaption] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUrlSubmit = () => {
    if (imageUrl) {
      const markdown = caption
        ? `![${altText || 'Image'}](${imageUrl})\n*${caption}*\n`
        : `![${altText || 'Image'}](${imageUrl})\n`
      onImageInsert(markdown)
      setImageUrl('')
      setAltText('')
      setCaption('')
      setShowUrlInput(false)
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Convert image to base64
    const reader = new FileReader()
    reader.onload = (event) => {
      const base64 = event.target?.result as string
      const markdown = caption
        ? `![${altText || file.name}](${base64})\n*${caption}*\n`
        : `![${altText || file.name}](${base64})\n`
      onImageInsert(markdown)
      setAltText('')
      setCaption('')
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
      <div className="flex items-center gap-2 mb-3">
        <ImageIcon size={20} className="text-primary" />
        <h3 className="font-bold text-sm">Ajouter une image</h3>
      </div>

      <div className="space-y-3">
        {/* File Upload Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
        >
          <Upload size={18} />
          <span className="text-sm">Télécharger une image</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* URL Input Toggle */}
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
        >
          <LinkIcon size={18} />
          <span className="text-sm">Ajouter une URL d'image</span>
        </button>

        {/* URL Input Form */}
        {showUrlInput && (
          <div className="space-y-2 p-3 bg-white rounded border border-gray-200">
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="Texte alternatif (optionnel)"
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Légende (optionnel)"
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleUrlSubmit}
                className="flex-1 px-3 py-2 bg-primary text-white rounded text-sm hover:bg-primary/90"
              >
                Insérer
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowUrlInput(false)
                  setImageUrl('')
                  setAltText('')
                  setCaption('')
                }}
                className="px-3 py-2 bg-gray-200 rounded text-sm hover:bg-gray-300"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500 mt-2">
          💡 Astuce : Les images seront insérées au format Markdown à la position du curseur
        </div>
      </div>
    </div>
  )
}
