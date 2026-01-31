import Link from 'next/link'
import WikiHeader from '@/components/WikiHeader'
import { getAllWikiMetadata } from '@/lib/wiki'
import { readFileSync } from 'fs'
import { join } from 'path'
import matter from 'gray-matter'

export const dynamic = 'force-dynamic'
export const revalidate = 0

function isNewArticle(lastUpdated: string): boolean {
  const articleDate = new Date(lastUpdated)
  const threeDaysAgo = new Date()
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)
  return articleDate >= threeDaysAgo
}

export default function CategoryPage({ params }: { params: { name: string } }) {
  const categoryName = decodeURIComponent(params.name)
  
  // Get all articles
  const allArticles = getAllWikiMetadata()
  
  // Filter articles by category
  const categoryArticles = allArticles.filter(
    article => article.category === categoryName
  )
  
  // Get full article data including lastUpdated
  const articlesWithDates = categoryArticles.map(article => {
    const fullPath = join(process.cwd(), 'content/wiki', `${article.slug}.md`)
    const fileContents = readFileSync(fullPath, 'utf8')
    const { data } = matter(fileContents)
    
    return {
      ...article,
      lastUpdated: typeof data.lastUpdated === 'string' 
        ? data.lastUpdated 
        : data.lastUpdated instanceof Date 
          ? data.lastUpdated.toISOString().split('T')[0]
          : String(data.lastUpdated)
    }
  })

  return (
    <main className="min-h-screen bg-gray-200">
      <WikiHeader />
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-serif font-bold mb-2">{categoryName}</h1>
        <p className="text-gray-600 mb-8">
          {articlesWithDates.length} article(s) dans cette catégorie
        </p>

        <div className="space-y-4">
          {articlesWithDates.length > 0 ? (
            articlesWithDates.map((article) => (
              <Link 
                key={article.slug}
                href={`/wiki/${article.slug}`} 
                className="block p-6 bg-wiki-bg border border-wiki-border rounded-lg hover:bg-gray-100 transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-primary mb-2">{article.title}</h3>
                    <p className="text-gray-600">{article.description}</p>
                  </div>
                  {isNewArticle(article.lastUpdated) && (
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
          <Link 
            href="/"
            className="text-primary hover:underline"
          >
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </main>
  )
}
