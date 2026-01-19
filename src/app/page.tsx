import Link from 'next/link'
import Image from 'next/image'
import { Search } from 'lucide-react'
import SearchBar from '@/components/SearchBar'
import WikiHeader from '@/components/WikiHeader'
import { getAllWikiMetadata } from '@/lib/wiki'

// Force dynamic rendering to always show latest articles
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function Home() {
  const articles = getAllWikiMetadata()
  const featuredArticles = articles.slice(0, 6) // Get first 6 articles
  return (
    <main className="min-h-screen bg-gray-200">
      <WikiHeader />
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Image 
              src="/logo.png" 
              alt="Musulmans Français Logo" 
              width={200} 
              height={200}
              className="object-contain"
            />
            <h1 className="text-6xl font-serif font-bold text-primary">Musulmans Français</h1>
          </div>
          <p className="text-xl text-gray-600">L'encyclopédie libre sur la Grande Mosquée de Paris</p>
          <p className="text-lg text-gray-700 mt-4 italic">
            À l'occasion du centenaire de la Grande Mosquée de Paris,
            en hommage à celles et ceux qui ont cru en la coexistence durable entre l'islam et la France.
          </p>
        </div>

        <div className="bg-wiki-bg border border-wiki-border rounded-lg p-8 mb-8">
          <div className="relative mb-6">
            <SearchBar />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {featuredArticles.length > 0 ? (
            featuredArticles.map((article) => (
              <Link 
                key={article.slug}
                href={`/wiki/${article.slug}`} 
                className="p-6 bg-wiki-bg border border-wiki-border rounded-lg hover:bg-gray-100 transition"
              >
                <h2 className="text-xl font-bold text-primary mb-2">{article.title}</h2>
                <p className="text-gray-600">{article.description}</p>
                <p className="text-xs text-gray-500 mt-2">{article.category}</p>
              </Link>
            ))
          ) : (
            <div className="col-span-3 text-center py-8">
              <p className="text-gray-600">Aucun article disponible. Créez votre premier article !</p>
            </div>
          )}
        </div>

        <div className="mt-12 text-center text-sm text-gray-500">
          <p>Musulmans Français contient {articles.length} article(s) sur la Grande Mosquée de Paris</p>
        </div>
      </div>
    </main>
  )
}
