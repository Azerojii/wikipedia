import Link from 'next/link'
import WikiHeader from '@/components/WikiHeader'
import { getArticlesByCategory } from '@/lib/wiki'

export const dynamic = 'force-dynamic'
export const revalidate = 0

function isNewArticle(date: string): boolean {
  const articleDate = new Date(date)
  const threeDaysAgo = new Date()
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)
  return articleDate >= threeDaysAgo
}

export default async function CategoryPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params
  const categoryName = decodeURIComponent(name)

  const articles = await getArticlesByCategory(categoryName)

  return (
    <main className="min-h-screen bg-gray-200">
      <WikiHeader />
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-serif font-bold mb-2">{categoryName}</h1>
        <p className="text-gray-600 mb-8">
          {articles.length} article(s) dans cette catégorie
        </p>

        <div className="space-y-4">
          {articles.length > 0 ? (
            articles.map((article) => (
              <Link
                key={article.slug}
                href={`/wiki/${article.slug}`}
                className="block p-6 bg-wiki-bg border border-wiki-border rounded-lg hover:bg-gray-100 transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-primary mb-2">{article.title}</h3>
                    <p className="text-gray-600">{article.excerpt}</p>
                  </div>
                  {isNewArticle(article.updated_at) && (
                    <span className="ml-4 px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full whitespace-nowrap">
                      Nouveaux articles
                    </span>
                  )}
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">Aucun article dans cette catégorie.</p>
            </div>
          )}
        </div>

        <div className="mt-8">
          <Link href="/" className="text-primary hover:underline">
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </main>
  )
}
