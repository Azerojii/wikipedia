'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import WikiHeader from '@/components/WikiHeader'
import WikiSidebar from '@/components/WikiSidebar'
import { Edit, Trash2, Plus, FolderPlus, Settings } from 'lucide-react'

interface Article {
  slug: string
  title: string
  description: string
  category: string
  lastUpdated: string
}

export default function AdminPage() {
  const router = useRouter()
  const [articles, setArticles] = useState<Article[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'articles' | 'categories'>('articles')

  useEffect(() => {
    fetchArticles()
    fetchCategories()
  }, [])

  const fetchArticles = async () => {
    try {
      const response = await fetch('/api/search')
      const data = await response.json()
      setArticles(data.results || data)
    } catch (error) {
      console.error('Error fetching articles:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    // Extract unique categories from articles
    const response = await fetch('/api/search')
    const data = await response.json()
    const articleData = data.results || data
    const uniqueCategories = Array.from(new Set(articleData.map((a: Article) => a.category)))
    setCategories(uniqueCategories as string[])
  }

  const handleDelete = async (slug: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      return
    }

    try {
      const response = await fetch(`/api/articles/${slug}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setArticles(articles.filter((a) => a.slug !== slug))
      } else {
        alert('Erreur lors de la suppression')
      }
    } catch (error) {
      console.error('Error deleting article:', error)
      alert('Erreur lors de la suppression')
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <WikiHeader />
      
      <div className="flex max-w-[1400px] mx-auto">
        <WikiSidebar />
        
        <main className="flex-1 px-6 py-4 max-w-[860px]">
          <div className="mb-6">
            <h1 className="text-4xl font-serif font-bold border-b border-gray-300 pb-2 mb-4">
              Administration
            </h1>
            <p className="text-gray-600">Gérez les articles et catégories de MuslimWiki</p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Link
              href="/admin/submissions"
              className="p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg hover:bg-yellow-100 transition"
            >
              <h3 className="text-lg font-bold text-yellow-800 mb-2">Soumissions en attente</h3>
              <p className="text-sm text-yellow-700">Examinez les articles soumis par les visiteurs</p>
            </Link>
            <Link
              href="/wiki/create"
              className="p-4 bg-green-50 border-2 border-green-300 rounded-lg hover:bg-green-100 transition"
            >
              <h3 className="text-lg font-bold text-green-800 mb-2">Créer un article</h3>
              <p className="text-sm text-green-700">Publiez directement un nouvel article</p>
            </Link>
            <div className="p-4 bg-blue-50 border-2 border-blue-300 rounded-lg">
              <h3 className="text-lg font-bold text-blue-800 mb-2">Articles publiés</h3>
              <p className="text-sm text-blue-700">{articles.length} article(s) en ligne</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-6 border-b border-gray-300">
            <button
              onClick={() => setActiveTab('articles')}
              className={`px-4 py-2 font-medium ${
                activeTab === 'articles'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-600 hover:text-primary'
              }`}
            >
              Articles
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`px-4 py-2 font-medium ${
                activeTab === 'categories'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-600 hover:text-primary'
              }`}
            >
              Catégories
            </button>
          </div>

          {/* Articles Tab */}
          {activeTab === 'articles' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Tous les articles</h2>
                <Link
                  href="/wiki/create"
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded hover:opacity-90"
                >
                  <Plus size={16} />
                  Nouvel article
                </Link>
              </div>

              {loading ? (
                <div className="text-center py-8">Chargement...</div>
              ) : articles.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Aucun article trouvé
                </div>
              ) : (
                <div className="space-y-4">
                  {articles.map((article) => (
                    <div
                      key={article.slug}
                      className="border border-gray-300 rounded-lg p-4 hover:bg-gray-50"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <Link
                            href={`/wiki/${article.slug}`}
                            className="text-xl font-bold text-primary hover:underline"
                          >
                            {article.title}
                          </Link>
                          <p className="text-gray-600 mt-1">{article.description}</p>
                          <div className="flex gap-4 mt-2 text-sm text-gray-500">
                            <span>Catégorie: {article.category}</span>
                            <span>Dernière mise à jour: {article.lastUpdated}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Link
                            href={`/wiki/${article.slug}/edit`}
                            className="p-2 text-primary hover:bg-primary/10 rounded"
                            title="Modifier"
                          >
                            <Edit size={18} />
                          </Link>
                          <button
                            onClick={() => handleDelete(article.slug)}
                            className="p-2 text-destructive hover:bg-destructive/10 rounded"
                            title="Supprimer"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Categories Tab */}
          {activeTab === 'categories' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Catégories</h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {categories.map((category) => (
                  <div
                    key={category}
                    className="border border-gray-300 rounded-lg p-4 hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-2">
                      <FolderPlus size={20} className="text-primary" />
                      <span className="font-medium">{category}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      {articles.filter((a) => a.category === category).length} article(s)
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

