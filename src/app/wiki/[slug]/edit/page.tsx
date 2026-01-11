'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import WikiHeader from '@/components/WikiHeader'
import WikiSidebar from '@/components/WikiSidebar'
import { Loader2, Plus } from 'lucide-react'

export default function EditArticlePage() {
  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('Histoire')
  const [content, setContent] = useState('')
  const [infoboxFields, setInfoboxFields] = useState<{ key: string; value: string }[]>([])
  const [youtubeVideos, setYoutubeVideos] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchArticle()
  }, [slug])

  const fetchArticle = async () => {
    try {
      const response = await fetch(`/api/articles/${slug}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load article')
      }

      setTitle(data.title)
      setDescription(data.description)
      setCategory(data.category)
      setContent(data.rawContent)
      
      if (data.infobox) {
        setInfoboxFields(
          Object.entries(data.infobox).map(([key, value]) => ({
            key,
            value: value as string,
          }))
        )
      }

      if (data.youtubeVideos && Array.isArray(data.youtubeVideos)) {
        setYoutubeVideos(data.youtubeVideos)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load article')
    } finally {
      setIsLoading(false)
    }
  }

  const addInfoboxField = () => {
    setInfoboxFields([...infoboxFields, { key: '', value: '' }])
  }

  const removeInfoboxField = (index: number) => {
    setInfoboxFields(infoboxFields.filter((_, i) => i !== index))
  }

  const updateInfoboxField = (index: number, field: 'key' | 'value', value: string) => {
    const updated = [...infoboxFields]
    updated[index][field] = value
    setInfoboxFields(updated)
  }

  const addYoutubeVideo = () => {
    setYoutubeVideos([...youtubeVideos, ''])
  }

  const removeYoutubeVideo = (index: number) => {
    setYoutubeVideos(youtubeVideos.filter((_, i) => i !== index))
  }

  const updateYoutubeVideo = (index: number, value: string) => {
    const updated = [...youtubeVideos]
    updated[index] = value
    setYoutubeVideos(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      // Convert infobox fields to object
      const infobox = infoboxFields.reduce((acc, field) => {
        if (field.key && field.value) {
          acc[field.key] = field.value
        }
        return acc
      }, {} as { [key: string]: string })

      // Filter out empty YouTube links
      const validYoutubeVideos = youtubeVideos.filter(video => video.trim() !== '')

      const response = await fetch(`/api/articles/${slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          category,
          content,
          infobox: Object.keys(infobox).length > 0 ? infobox : undefined,
          youtubeVideos: validYoutubeVideos.length > 0 ? validYoutubeVideos : undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update article')
      }

      // Redirect to the article
      router.push(`/wiki/${slug}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update article')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <WikiHeader />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <WikiHeader />
      
      <div className="flex max-w-[1400px] mx-auto">
        <WikiSidebar />
        
        <main className="flex-1 px-6 py-4 max-w-[860px]">
          <h1 className="text-4xl font-serif font-bold border-b border-gray-300 pb-2 mb-6">
            Modifier l'article
          </h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-bold mb-2">
                Titre de l'article <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., Grande Mosquée de Paris"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-bold mb-2">
                Description courte
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Une brève description en une ligne"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-bold mb-2">
                Catégorie
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option>Histoire</option>
                <option>Architecture</option>
                <option>Culture</option>
                <option>Religion</option>
                <option>Événements</option>
                <option>Personnalités</option>
                <option>Général</option>
              </select>
            </div>

            {/* Infobox */}
            <div>
              <label className="block text-sm font-bold mb-2">
                Infobox (Optionnel)
              </label>
              <div className="space-y-2">
                {infoboxFields.map((field, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={field.key}
                      onChange={(e) => updateInfoboxField(index, 'key', e.target.value)}
                      placeholder="Clé (e.g., Fondation)"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    />
                    <input
                      type="text"
                      value={field.value}
                      onChange={(e) => updateInfoboxField(index, 'value', e.target.value)}
                      placeholder="Valeur (e.g., 1926)"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeInfoboxField(index)}
                      className="px-3 py-2 bg-destructive text-white rounded hover:opacity-90 text-sm"
                    >
                      Supprimer
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addInfoboxField}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm"
                >
                  Ajouter un champ Infobox
                </button>
              </div>
            </div>

            {/* YouTube Videos */}
            <div>
              <label className="block text-sm font-bold mb-2">
                Vidéos YouTube (Optionnel)
              </label>
              <div className="text-xs text-gray-600 mb-2">
                Ajoutez des liens YouTube à intégrer dans l'article (ex: https://www.youtube.com/watch?v=VIDEO_ID)
              </div>
              <div className="space-y-2">
                {youtubeVideos.map((video, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="url"
                      value={video}
                      onChange={(e) => updateYoutubeVideo(index, e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeYoutubeVideo(index)}
                      className="px-3 py-2 bg-destructive text-white rounded hover:opacity-90 text-sm"
                    >
                      Supprimer
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addYoutubeVideo}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm"
                >
                  Ajouter une vidéo YouTube
                </button>
              </div>
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-bold mb-2">
                Contenu de l'article (Markdown) <span className="text-red-500">*</span>
              </label>
              <div className="text-xs text-gray-600 mb-2">
                Utilisez la syntaxe Markdown. Pour les liens internes, utilisez: [[Nom de l'article]]
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={20}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
                placeholder="# Titre de l'article

## Introduction

Votre contenu ici...

## Voir aussi

- [[Article lié 1]]
- [[Article lié 2]]"
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting || !title || !content}
                className="px-6 py-3 bg-primary text-white rounded hover:opacity-90 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  'Enregistrer les modifications'
                )}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded font-medium"
              >
                Annuler
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  )
}

