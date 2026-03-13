'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Loader2 } from 'lucide-react'

const QuillEditor = dynamic(() => import('@/components/QuillEditor'), { ssr: false })

interface SuggestEditFormProps {
  slug: string
  articleTitle: string
  currentContent: string
  currentExcerpt: string
  currentCategories: string[]
  allCategories: string[]
}

export default function SuggestEditForm({
  slug,
  articleTitle,
  currentContent,
  currentExcerpt,
  currentCategories,
  allCategories,
}: SuggestEditFormProps) {
  const router = useRouter()
  const [suggestedTitle, setSuggestedTitle] = useState(articleTitle)
  const [suggestedExcerpt, setSuggestedExcerpt] = useState(currentExcerpt)
  const [suggestedContent, setSuggestedContent] = useState(currentContent)
  const [suggestedCategories, setSuggestedCategories] = useState<string[]>(currentCategories)
  const [reason, setReason] = useState('')
  const [suggesterName, setSuggesterName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const toggleCategory = (cat: string) => {
    setSuggestedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/edit-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          article_slug: slug,
          article_title: articleTitle,
          suggested_content: suggestedContent,
          suggested_title: suggestedTitle !== articleTitle ? suggestedTitle : undefined,
          suggested_excerpt: suggestedExcerpt !== currentExcerpt ? suggestedExcerpt : undefined,
          suggested_categories:
            JSON.stringify(suggestedCategories) !== JSON.stringify(currentCategories)
              ? suggestedCategories
              : undefined,
          reason: reason || undefined,
          suggester_name: suggesterName || undefined,
        }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Échec de la soumission')

      setSuccess(true)
      setTimeout(() => router.push(`/wiki/${slug}`), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Échec de la soumission')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded p-6 text-center">
        <p className="text-green-800 font-bold text-lg">Suggestion envoyée avec succès !</p>
        <p className="text-green-700 text-sm mt-1">Elle sera examinée par un administrateur. Redirection en cours...</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-bold mb-1">Titre</label>
        <input
          type="text"
          value={suggestedTitle}
          onChange={(e) => setSuggestedTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-bold mb-1">Description / Extrait</label>
        <textarea
          value={suggestedExcerpt}
          onChange={(e) => setSuggestedExcerpt(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-bold mb-1">Catégories</label>
        <div className="flex flex-wrap gap-2 mt-1">
          {allCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => toggleCategory(cat)}
              className={`px-3 py-1 rounded-full text-sm border transition ${
                suggestedCategories.includes(cat)
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold mb-1">
          Contenu <span className="text-red-500">*</span>
        </label>
        <QuillEditor
          value={suggestedContent}
          onChange={setSuggestedContent}
          placeholder="Contenu de l'article..."
        />
      </div>

      <div>
        <label className="block text-sm font-bold mb-1">Raison de la modification</label>
        <input
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Expliquez brièvement votre modification..."
        />
      </div>

      <div>
        <label className="block text-sm font-bold mb-1">Votre nom (optionnel)</label>
        <input
          type="text"
          value={suggesterName}
          onChange={(e) => setSuggesterName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Votre nom"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting || !suggestedContent}
          className="px-5 py-2 bg-primary text-white rounded hover:opacity-90 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-medium"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Envoi...
            </>
          ) : (
            'Envoyer la suggestion'
          )}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-5 py-2 bg-gray-200 hover:bg-gray-300 rounded font-medium text-sm"
        >
          Annuler
        </button>
      </div>
    </form>
  )
}
