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

function getDepartmentStats(articles: WikiArticle[]): Record<string, number> {
  const stats: Record<string, number> = {}
  for (const a of articles) {
    const dept =
      (a.mosque_data as Record<string, unknown> | null)?.department as string | undefined ||
      (a.imam_data as Record<string, unknown> | null)?.department as string | undefined ||
      (a.burial_data as Record<string, unknown> | null)?.department as string | undefined
    if (dept) {
      stats[dept] = (stats[dept] || 0) + 1
    }
  }
  return stats
}

function getTypeStats(articles: WikiArticle[]): Record<string, number> {
  const stats: Record<string, number> = {}
  const typeLabels: Record<string, string> = {
    mosque: 'Mosquées',
    imam: 'Imams',
    burial: 'Sépultures',
    article: 'Articles',
  }
  for (const a of articles) {
    const type = (a.article_type as string) || 'article'
    const label = typeLabels[type] || type
    stats[label] = (stats[label] || 0) + 1
  }
  return stats
}

export default async function CategoryPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params
  const categoryName = decodeURIComponent(name)

  const articles = await getArticlesByCategory(categoryName)
  const regionStats = getRegionStats(articles)
  const regionEntries = Object.entries(regionStats).sort((a, b) => b[1] - a[1])
  const deptStats = getDepartmentStats(articles)
  const deptEntries = Object.entries(deptStats).sort((a, b) => b[1] - a[1])
  const typeStats = getTypeStats(articles)
  const typeEntries = Object.entries(typeStats).sort((a, b) => b[1] - a[1])

  return (
    <main className="min-h-screen bg-[#f5f6f8]">
      <WikiHeader />
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-10">
        <nav className="text-sm text-gray-500 mb-4" aria-label="Fil d'Ariane">
          <Link href="/" className="text-primary hover:underline">Accueil</Link>
          <span className="mx-1.5 text-gray-300">›</span>
          <span className="text-gray-700">{categoryName}</span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-serif font-bold mb-1">{categoryName}</h1>
        <p className="text-gray-500 text-sm mb-6">
          {articles.length} article{articles.length !== 1 ? 's' : ''} dans cette catégorie
        </p>

        {(regionEntries.length > 0 || deptEntries.length > 0 || typeEntries.length > 0) && (
          <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 shadow-sm space-y-4">
            {typeEntries.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Par type</h3>
                <div className="flex flex-wrap gap-1.5">
                  {typeEntries.map(([type, count]) => (
                    <span key={type} className="px-2.5 py-1 bg-blue-50 border border-blue-200 rounded-full text-xs text-blue-700">
                      {type} ({count})
                    </span>
                  ))}
                </div>
              </div>
            )}
            {regionEntries.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Répartition par région</h3>
                <div className="flex flex-wrap gap-1.5">
                  {regionEntries.map(([region, count]) => (
                    <span key={region} className="px-2.5 py-1 bg-gray-50 border border-gray-200 rounded-full text-xs text-gray-600">
                      {region} ({count})
                    </span>
                  ))}
                </div>
              </div>
            )}
            {deptEntries.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Répartition par département</h3>
                <div className="flex flex-wrap gap-1.5">
                  {deptEntries.map(([dept, count]) => (
                    <span key={dept} className="px-2.5 py-1 bg-green-50 border border-green-200 rounded-full text-xs text-green-700">
                      {dept} ({count})
                    </span>
                  ))}
                </div>
              </div>
            )}
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
