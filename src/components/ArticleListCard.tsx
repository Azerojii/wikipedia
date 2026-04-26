import Link from 'next/link'
import { Eye } from 'lucide-react'
import type { WikiArticle } from '@/lib/wiki'

function getTypeLabel(type: string): string {
  switch (type) {
    case 'imam': return 'Imam'
    case 'mosque': return 'Mosquée'
    case 'burial': return 'Défunt'
    case 'article': return 'Article'
    default: return type
  }
}

export default function ArticleListCard({ article, viewCount }: { article: WikiArticle; viewCount?: number }) {
  return (
    <Link
      href={`/wiki/${encodeURIComponent(article.slug)}`}
      className="group block bg-white border border-gray-200 rounded-lg p-4 hover:border-primary/30 hover:shadow-md transition-all hover:no-underline"
    >
      <div className="flex items-start gap-3">
        {article.image_url && (
          <img
            src={article.image_url}
            alt={article.title}
            className="w-12 h-12 rounded object-cover flex-shrink-0"
          />
        )}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1 text-xs text-gray-500">
            <span className="font-semibold text-primary">{getTypeLabel(article.article_type)}</span>
            {article.categories?.[0] && (
              <span className="text-gray-400">{article.categories[0]}</span>
            )}
            <span className="ml-auto text-gray-400">
              {new Date(article.updated_at).toLocaleDateString('fr-FR')}
            </span>
          </div>
          <h3 className="font-bold text-primary group-hover:text-primary/80 transition-colors line-clamp-2">
            {article.title}
          </h3>
          {article.excerpt && (
            <p className="mt-1 text-sm text-gray-500 line-clamp-1">{article.excerpt}</p>
          )}
          {viewCount != null && viewCount > 0 && (
            <div className="flex items-center gap-1 mt-1.5 text-xs text-primary font-semibold">
              <Eye size={12} />
              {viewCount.toLocaleString('fr-FR')} vues
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
