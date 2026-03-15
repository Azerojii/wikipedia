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
    <main className="min-h-screen bg-[#f5f6f8]">
      <WikiHeader />
      <div className="max-w-4xl mx-auto px-4 py-6 md:py-10">
        <nav className="text-sm text-gray-500 mb-4" aria-label="Fil d'Ariane">
          <Link href="/" className="text-primary hover:underline">Accueil</Link>
          <span className="mx-1.5 text-gray-300">›</span>
          <span className="text-gray-700">{categoryName}</span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-serif font-bold mb-1">{categoryName}</h1>
        <p className="text-gray-500 text-sm mb-6">
          {articles.length} article{articles.length !== 1 ? 's' : ''} dans cette catégorie
        </p>

        {regionEntries.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 shadow-sm">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Répartition par région</h3>
            <div className="flex flex-wrap gap-1.5">
              {regionEntries.map(([region, count]) => (
                <span
                  key={region}
                  className="px-2.5 py-1 bg-gray-50 border border-gray-200 rounded-full text-xs text-gray-600"
                >
                  {region} ({count})
                </span>
              ))}
            </div>
          </div>
        )}

        <CategoryArticleList articles={articles} />

        <div className="mt-8">
          <Link href="/" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
            &larr; Retour à l&apos;accueil
          </Link>
        </div>
      </div>
      <WikiFooter />
    </main>
  )
}
