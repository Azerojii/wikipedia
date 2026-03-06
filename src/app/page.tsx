import Link from 'next/link'
import Image from 'next/image'
import SearchBar from '@/components/SearchBar'
import WikiHeader from '@/components/WikiHeader'
import AllArticlesList from '@/components/AllArticlesList'
import { getAllArticles, getAllCategories } from '@/lib/wiki'

export const dynamic = 'force-dynamic'
export const revalidate = 0

function isNewArticle(date: string): boolean {
  const articleDate = new Date(date)
  const threeDaysAgo = new Date()
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)
  return articleDate >= threeDaysAgo
}

export default async function Home() {
  const [articles, categories] = await Promise.all([getAllArticles(), getAllCategories()])

  const categoryData = categories.map(cat => {
    const categoryArticles = articles.filter(a => a.categories?.includes(cat.name))
    const hasNewArticles = categoryArticles.some(a => isNewArticle(a.updated_at))
    return { name: cat.name, hasNewArticles }
  })

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

        <h2 className="text-2xl font-serif font-bold mb-4">Catégories</h2>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {categoryData.length > 0 ? (
            categoryData.map((category) => (
              <Link
                key={category.name}
                href={`/category/${encodeURIComponent(category.name)}`}
                className="p-6 bg-wiki-bg border border-wiki-border rounded-lg hover:bg-gray-100 transition"
              >
                <h3 className="text-xl font-bold text-primary mb-2">{category.name}</h3>
                {category.hasNewArticles && (
                  <span className="inline-block px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full">
                    Nouveaux articles
                  </span>
                )}
              </Link>
            ))
          ) : (
            <div className="col-span-3 text-center py-8">
              <p className="text-gray-600">Aucune catégorie disponible.</p>
            </div>
          )}
        </div>

        <AllArticlesList articles={articles} />

        <div className="mt-12 text-center text-sm text-gray-500">
          <p>Musulmans Français contient {articles.length} article(s) sur la Grande Mosquée de Paris</p>
        </div>
      </div>
    </main>
  )
}
