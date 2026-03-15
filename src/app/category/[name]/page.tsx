import Link from 'next/link'
import WikiHeader from '@/components/WikiHeader'
import WikiFooter from '@/components/WikiFooter'
import CategoryArticleList from '@/components/CategoryArticleList'
import { getArticlesByCategory } from '@/lib/wiki'
import type { WikiArticle } from '@/lib/wiki'

export const dynamic = 'force-dynamic'
export const revalidate = 0

function getRegionStats(articles: WikiArticle[]): Record<string, number> {
  const stats: Record<string, number> = {}
  for (const a of articles) {
    const region =
      (a.mosque_data as Record<string, unknown> | null)?.region as string | undefined ||
      (a.imam_data as Record<string, unknown> | null)?.region as string | undefined ||
      (a.burial_data as Record<string, unknown> | null)?.region as string | undefined
    if (region) {
      stats[region] = (stats[region] || 0) + 1
    }
  }
  return stats
}

export default async function CategoryPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params
  const categoryName = decodeURIComponent(name)

  const articles = await getArticlesByCategory(categoryName)
  const regionStats = getRegionStats(articles)
  const regionEntries = Object.entries(regionStats).sort((a, b) => b[1] - a[1])

  return (
    <main className="min-h-screen bg-gray-200">
      <WikiHeader />
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-serif font-bold mb-2">{categoryName}</h1>
        <p className="text-gray-600 mb-4">
          {articles.length} article(s) dans cette catégorie
        </p>

        {regionEntries.length > 0 && (
          <div className="bg-wiki-bg border border-wiki-border rounded-lg p-4 mb-8">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Répartition par région</h3>
            <div className="flex flex-wrap gap-2">
              {regionEntries.map(([region, count]) => (
                <span
                  key={region}
                  className="px-2.5 py-1 bg-white border border-gray-300 rounded-full text-xs text-gray-700"
                >
                  {region} ({count})
                </span>
              ))}
            </div>
          </div>
        )}

        <CategoryArticleList articles={articles} />

        <div className="mt-8">
          <Link href="/" className="text-primary hover:underline">
            &larr; Retour &agrave; l&apos;accueil
          </Link>
        </div>
      </div>
      <WikiFooter />
    </main>
  )
}
