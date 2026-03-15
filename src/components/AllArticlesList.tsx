'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { WikiArticle } from '@/lib/wiki'

interface AllArticlesListProps {
  articles: WikiArticle[]
}

const INITIAL_DISPLAY = 10

function getArticleImage(article: WikiArticle): string | null {
  if (article.image_url) return article.image_url
  if (article.mosque_data?.image?.src) return article.mosque_data.image.src
  if (article.imam_data?.image?.src) return article.imam_data.image.src
  if (article.burial_data?.image?.src) return article.burial_data.image.src
  if (article.infobox?.image?.src) return article.infobox.image.src
  return null
}

export default function AllArticlesList({ articles }: AllArticlesListProps) {
  const [showAll, setShowAll] = useState(false)
  const displayedArticles = showAll ? articles : articles.slice(0, INITIAL_DISPLAY)

  if (articles.length === 0) {
    return null
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-serif font-bold mb-4">Tous les articles</h2>
      <div className="space-y-3">
        {displayedArticles.map((article) => {
          const imageUrl = getArticleImage(article)
          return (
            <Link
              key={article.slug}
              href={`/wiki/${article.slug}`}
              className="group block p-4 bg-white border border-gray-200 rounded-xl hover:border-primary/30 hover:shadow-md transition-all duration-200"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-3 flex-1">
                  {imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imageUrl}
                      alt={article.title}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-full object-cover flex-shrink-0 border-2 border-gray-100"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-primary group-hover:text-primary/80 transition-colors">
                        {article.title}
                      </h3>
                      {article.article_type === 'mosque' && (
                        <span className="px-2 py-0.5 bg-teal-50 text-teal-700 text-xs font-medium rounded-full">
                          🕌 Mosquée
                        </span>
                      )}
                      {article.article_type === 'imam' && (
                        <span className="px-2 py-0.5 bg-purple-50 text-purple-700 text-xs font-medium rounded-full">
                          👤 Imam
                        </span>
                      )}
                      {article.article_type === 'burial' && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                          🪦 Sépulture
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{article.excerpt}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400 ml-4 flex-shrink-0 mt-1">
                  {article.categories?.[0] ?? ''}
                </span>
              </div>
            </Link>
          )
        })}

        {articles.length > INITIAL_DISPLAY && (
          <div className="mt-4 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm rounded-lg hover:opacity-90 transition-all shadow-sm"
            >
              {showAll ? (
                <>
                  <ChevronUp size={18} />
                  Voir moins
                </>
              ) : (
                <>
                  <ChevronDown size={18} />
                  Voir plus ({articles.length - INITIAL_DISPLAY} articles restants)
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
