'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { WikiArticle } from '@/lib/wiki'

interface AllArticlesListProps {
  articles: WikiArticle[]
}

const PAGE_SIZE = 10

function getArticleImage(article: WikiArticle): string | null {
  if (article.image_url) return article.image_url
  if (article.mosque_data?.image?.src) return article.mosque_data.image.src
  if (article.imam_data?.image?.src) return article.imam_data.image.src
  if (article.burial_data?.image?.src) return article.burial_data.image.src
  if (article.infobox?.image?.src) return article.infobox.image.src
  return null
}

export default function AllArticlesList({ articles }: AllArticlesListProps) {
  const [page, setPage] = useState(1)
  const totalPages = Math.max(1, Math.ceil(articles.length / PAGE_SIZE))
  const startIndex = (page - 1) * PAGE_SIZE
  const displayedArticles = articles.slice(startIndex, startIndex + PAGE_SIZE)

  if (articles.length === 0) {
    return null
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-serif font-bold mb-4">Tous les articles</h2>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {displayedArticles.map((article) => {
          const imageUrl = getArticleImage(article)

          return (
            <Link
              key={article.slug}
              href={`/wiki/${article.slug}`}
              className="group block rounded-xl border border-gray-200 bg-white p-4 hover:border-primary/30 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start gap-3">
                {imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imageUrl}
                    alt={article.title}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="h-14 w-14 rounded-xl object-cover flex-shrink-0 border-2 border-gray-100"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                ) : article.article_type === 'mosque' ? (
                  <div className="h-14 w-14 rounded-xl flex-shrink-0 flex items-center justify-center border-2 border-teal-100 bg-teal-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/mosquee.png" alt="" className="w-10 h-10 object-contain" />
                  </div>
                ) : article.article_type === 'imam' ? (
                  <div className="h-14 w-14 rounded-xl flex-shrink-0 flex items-center justify-center bg-blue-500">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/muslimah_white.png" alt="" className="w-10 h-10 object-contain" />
                  </div>
                ) : null}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-bold text-primary group-hover:text-primary/80 transition-colors">
                      {article.title}
                    </h3>

                    {article.article_type === 'mosque' && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2 py-0.5 text-xs font-medium text-teal-700">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/mosquee.png" alt="" className="w-3.5 h-3.5 object-contain" />
                        Mosquée
                      </span>
                    )}

                    {article.article_type === 'imam' && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-500 px-2 py-0.5 text-xs font-medium text-white">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/muslimah_white.png" alt="" className="w-3.5 h-3.5 object-contain" />
                        Imam
                      </span>
                    )}

                    {article.article_type === 'burial' && (
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                        Mort musulman
                      </span>
                    )}

                    {article.categories?.[0] && (
                      <span className="hidden text-xs text-gray-400 sm:inline">
                        {article.categories[0]}
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-sm text-gray-500 line-clamp-3">{article.excerpt}</p>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-1">
          <button
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={page === 1}
            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronLeft size={16} />
            Précédent
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => {
              if (totalPages <= 5) return true
              if (p === 1 || p === totalPages) return true
              if (Math.abs(p - page) <= 1) return true
              return false
            })
            .reduce<(number | '…')[]>((acc, p, idx, arr) => {
              if (idx > 0 && (p as number) - (arr[idx - 1] as number) > 1) acc.push('…')
              acc.push(p)
              return acc
            }, [])
            .map((p, idx) =>
              p === '…' ? (
                <span key={`ellipsis-${idx}`} className="px-2 py-2 text-sm text-gray-400">…</span>
              ) : (
                <button
                  key={p}
                  onClick={() => setPage(p as number)}
                  className={`min-w-[36px] rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    page === p
                      ? 'bg-primary text-white'
                      : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {p}
                </button>
              )
            )}

          <button
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            disabled={page === totalPages}
            className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Suivant
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  )
}
