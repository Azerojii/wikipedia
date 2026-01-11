'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import WikiHeader from '@/components/WikiHeader'
import WikiSidebar from '@/components/WikiSidebar'
import { Loader2, Plus, Info } from 'lucide-react'

export default function SubmitArticlePage() {
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('Histoire')
  const [content, setContent] = useState('')
  const [submitterName, setSubmitterName] = useState('')
  const [submitterEmail, setSubmitterEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          category,
          content,
          submitterName,
          submitterEmail,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit article')
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/')
      }, 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit article')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-white">
        <WikiHeader />
        
        <div className="flex max-w-[1400px] mx-auto">
          <WikiSidebar />
          
          <main className="flex-1 px-6 py-4 max-w-[860px]">
            <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
              <h1 className="text-3xl font-serif font-bold text-green-800 mb-4">
                Soumission réussie !
              </h1>
              <p className="text-green-700 mb-4">
                Votre article a été soumis avec succès. Il sera examiné par un administrateur avant d'être publié.
              </p>
              <p className="text-sm text-green-600">
                Vous allez être redirigé vers la page d'accueil...
              </p>
            </div>
          </main>
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
            Soumettre un article
          </h1>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex gap-3">
            <Info className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">Soumission publique</p>
              <p>
                Votre article sera examiné par un administrateur avant d'être publié sur MuslimWiki.
                Vous recevrez une notification par email si vous en fournissez un.
              </p>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Submitter Info */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-4">
              <h3 className="font-bold text-lg">Vos informations (optionnel)</h3>
              
              <div>
                <label className="block text-sm font-bold mb-2">
                  Votre nom
                </label>
                <input
                  type="text"
                  value={submitterName}
                  onChange={(e) => setSubmitterName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Votre nom (optionnel)"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">
                  Votre email
                </label>
                <input
                  type="email"
                  value={submitterEmail}
                  onChange={(e) => setSubmitterEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="votre.email@example.com (optionnel)"
                />
              </div>
            </div>

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
                    Envoi en cours...
                  </>
                ) : (
                  'Soumettre l\'article'
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

