'use client'

import { useCallback, useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

interface GalleryImage {
  src: string
  caption?: string
}

interface MosqueGalleryLightboxProps {
  images: GalleryImage[]
}

export default function MosqueGalleryLightbox({ images }: MosqueGalleryLightboxProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const goNext = useCallback(() => {
    setActiveIndex(prev => prev === null ? null : (prev + 1) % images.length)
  }, [images.length])

  const goPrev = useCallback(() => {
    setActiveIndex(prev => prev === null ? null : (prev - 1 + images.length) % images.length)
  }, [images.length])

  useEffect(() => {
    if (activeIndex === null) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [activeIndex])

  useEffect(() => {
    if (activeIndex === null) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext()
      else if (e.key === 'ArrowLeft') goPrev()
      else if (e.key === 'Escape') setActiveIndex(null)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [activeIndex, goNext, goPrev])

  if (images.length === 0) return null

  return (
    <>
      <div className="mt-4">
        <h3 className="text-sm font-semibold text-gray-600 mb-2">Galerie photos</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className="overflow-hidden rounded-lg border border-gray-200 aspect-square hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <img src={img.src} alt={img.caption || `Photo ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      {activeIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={() => setActiveIndex(null)}
        >
          <button
            onClick={e => { e.stopPropagation(); setActiveIndex(null) }}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            aria-label="Fermer"
          >
            <X size={32} />
          </button>

          {images.length > 1 && (
            <>
              <button
                onClick={e => { e.stopPropagation(); goPrev() }}
                className="absolute left-4 text-white hover:text-gray-300 z-10"
                aria-label="Précédent"
              >
                <ChevronLeft size={40} />
              </button>
              <button
                onClick={e => { e.stopPropagation(); goNext() }}
                className="absolute right-4 text-white hover:text-gray-300 z-10"
                aria-label="Suivant"
              >
                <ChevronRight size={40} />
              </button>
            </>
          )}

          <div
            className="max-w-4xl max-h-[85vh] mx-12 flex flex-col items-center gap-3"
            onClick={e => e.stopPropagation()}
          >
            <img
              src={images[activeIndex].src}
              alt={images[activeIndex].caption || `Photo ${activeIndex + 1}`}
              className="max-w-full max-h-[75vh] object-contain rounded"
            />
            {images[activeIndex].caption && (
              <p className="text-white/80 text-sm text-center">{images[activeIndex].caption}</p>
            )}
            <p className="text-white/50 text-xs">{activeIndex + 1} / {images.length}</p>
          </div>
        </div>
      )}
    </>
  )
}
