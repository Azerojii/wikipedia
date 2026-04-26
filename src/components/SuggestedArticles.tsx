import Link from 'next/link'
import { getSuggestedArticles } from '@/lib/wiki'
import type { WikiArticle } from '@/lib/wiki'

function getTypeLabel(type: string): string {
  switch (type) {
    case 'imam': return 'Imams similaires'
    case 'mosque': return 'Mosquées similaires'
    case 'burial': return 'Articles similaires'
    default: return 'Articles similaires'
  }
}

function SuggestedCard({ article }: { article: WikiArticle }) {
  return (
    <Link
      href={`/wiki/${encodeURIComponent(article.slug)}`}
      className="flex items-start gap-2 p-2 rounded hover:bg-primary/5 transition-colors group hover:no-underline"
    >
      {article.image_url ? (
        <div className="w-10 h-10 flex-shrink-0 overflow-hidden rounded">
          <img src={article.image_url} alt={article.title} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="w-10 h-10 flex-shrink-0 bg-primary/10 rounded flex items-center justify-center text-xs text-primary font-bold">
          {article.title.charAt(0)}
        </div>
      )}
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-800 group-hover:text-primary transition-colors leading-tight line-clamp-2">
          {article.title}
        </p>
        {article.excerpt && (
          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{article.excerpt}</p>
        )}
      </div>
    </Link>
  )
}

export default async function SuggestedArticles({
  currentSlug,
  articleType,
}: {
  currentSlug: string
  articleType: string
}) {
  const suggested = await getSuggestedArticles(currentSlug, articleType, 5)
  if (suggested.length === 0) return null

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden mt-4">
      <div className="bg-primary text-white text-sm font-semibold px-3 py-2">
        {getTypeLabel(articleType)}
      </div>
      <div className="divide-y divide-gray-100">
        {suggested.map(article => (
          <SuggestedCard key={article.slug} article={article} />
        ))}
      </div>
    </div>
  )
}
