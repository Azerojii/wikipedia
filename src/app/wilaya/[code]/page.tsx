import Link from 'next/link'
import { MapPin } from 'lucide-react'
import ArticleListCard from '@/components/ArticleListCard'
import PaginationControls from '@/components/PaginationControls'
import WikiHeader from '@/components/WikiHeader'
import WikiFooter from '@/components/WikiFooter'
import { getArticlesByWilaya, getViewCountsBySlugs } from '@/lib/wiki'

export const dynamic = 'force-dynamic'

const PAGE_SIZE = 10

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  const regionName = decodeURIComponent(code)
  return {
    title: `${regionName} - Musulmans Français`,
  }
}

export default async function WilayaPage({
  params,
  searchParams,
}: {
  params: Promise<{ code: string }>
  searchParams?: Promise<{ page?: string }>
}) {
  const { code } = await params
  const query = (await searchParams) || {}
  const pageValue = Number.parseInt(query.page || '1', 10)

  const regionName = decodeURIComponent(code)
  const articles = await getArticlesByWilaya(regionName)
  const sortedArticles = [...articles].sort((a, b) => a.title.localeCompare(b.title, 'fr'))
  const viewCounts = await getViewCountsBySlugs(sortedArticles.map(a => a.slug))

  const totalPages = Math.max(1, Math.ceil(sortedArticles.length / PAGE_SIZE))
  const currentPage = Number.isFinite(pageValue)
    ? Math.min(Math.max(pageValue, 1), totalPages)
    : 1

  const startIndex = (currentPage - 1) * PAGE_SIZE
  const paginatedArticles = sortedArticles.slice(startIndex, startIndex + PAGE_SIZE)

  const stats = {
    imam: articles.filter(a => a.article_type === 'imam').length,
    mosque: articles.filter(a => a.article_type === 'mosque').length,
    burial: articles.filter(a => a.article_type === 'burial').length,
    article: articles.filter(a => a.article_type === 'article').length,
  }

  return (
    <div className="min-h-screen bg-[#f5f6f8]">
      <WikiHeader />

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-6">
        <nav className="text-sm text-gray-500 mb-4 flex items-center gap-2">
          <Link href="/" className="text-primary hover:underline">Accueil</Link>
          <span className="text-gray-300">›</span>
          <span className="flex items-center gap-1 text-gray-700">
            <MapPin size={14} />
            {regionName}
          </span>
        </nav>

        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
          <h1 className="text-2xl md:text-3xl font-serif font-bold flex items-center gap-2 mb-2">
            <MapPin size={28} className="text-primary" />
            {regionName}
          </h1>
          <p className="text-sm text-gray-500">
            {articles.length} article{articles.length !== 1 ? 's' : ''}
            {stats.imam > 0 && ` · ${stats.imam} imam${stats.imam !== 1 ? 's' : ''}`}
            {stats.mosque > 0 && ` · ${stats.mosque} mosquée${stats.mosque !== 1 ? 's' : ''}`}
            {stats.burial > 0 && ` · ${stats.burial} défunt${stats.burial !== 1 ? 's' : ''}`}
          </p>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-16 text-gray-500 bg-white rounded-xl border border-gray-200">
            <MapPin size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg">Aucun article pour cette région.</p>
          </div>
        ) : (
          <>
            <p className="text-xs text-gray-400 mb-3">
              {startIndex + 1}–{Math.min(startIndex + PAGE_SIZE, sortedArticles.length)} sur {sortedArticles.length}
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {paginatedArticles.map(article => (
                <ArticleListCard
                  key={article.slug}
                  article={article}
                  viewCount={viewCounts[article.slug]}
                />
              ))}
            </div>
            <PaginationControls
              basePath={`/wilaya/${encodeURIComponent(regionName)}`}
              currentPage={currentPage}
              totalPages={totalPages}
            />
          </>
        )}
      </div>
      <WikiFooter />
    </div>
  )
}
