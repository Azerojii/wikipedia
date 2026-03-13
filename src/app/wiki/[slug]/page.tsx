import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getArticle, generateTableOfContents } from '@/lib/wiki'
import WikiHeader from '@/components/WikiHeader'
import WikiFooter from '@/components/WikiFooter'
import WikiSidebar from '@/components/WikiSidebar'
import TableOfContents from '@/components/TableOfContents'
import Infobox from '@/components/Infobox'
import MosqueInfobox from '@/components/MosqueInfobox'
import ImamInfobox from '@/components/ImamInfobox'
import SuggestEditButton from '@/components/SuggestEditButton'
import PrintButton from '@/components/PrintButton'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import YouTubeVideos from '@/components/YouTubeVideos'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await getArticle(slug)

  if (!article) {
    return { title: 'Article Not Found' }
  }

  return {
    title: `${article.title} - MuslimWiki`,
    description: article.excerpt,
  }
}

export default async function WikiPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await getArticle(slug)

  if (!article) {
    notFound()
  }

  const toc = generateTableOfContents(article.content)

  return (
    <div className="min-h-screen bg-white">
      <WikiHeader />

      <div className="flex max-w-[1400px] mx-auto">
        <WikiSidebar />

        <main className="flex-1 px-6 py-4 max-w-[860px]">
          {/* Breadcrumbs */}
          <div className="text-sm text-gray-600 mb-4">
            <Link href="/" className="text-primary hover:underline">
              Accueil
            </Link>
            <span className="mx-2">›</span>
            <span>{article.categories?.[0] ?? ''}</span>
            <span className="mx-2">›</span>
            <span className="text-gray-900">{article.title}</span>
          </div>

          <div className="flex gap-2 flex-wrap mb-4">
            <SuggestEditButton slug={slug} currentContent={article.content} articleTitle={article.title} />
            <PrintButton />
          </div>

          <h1 className="text-4xl font-serif font-bold border-b border-gray-300 pb-2 mb-4">
            {article.title}
          </h1>

          <div className="flex gap-6">
            <div className="flex-1">
              <MarkdownRenderer content={article.content} />

              {/* Footer */}
              <div className="mt-12 pt-6 border-t border-gray-300">
                <div className="text-sm text-gray-600">
                  <p>
                    <strong>Dernière mise à jour:</strong>{' '}
                    {new Date(article.updated_at).toLocaleDateString('fr-FR')}
                  </p>
                  {article.categories?.length > 0 && (
                    <p className="mt-2">
                      <strong>Catégorie:</strong>{' '}
                      <span className="text-primary">{article.categories[0]}</span>
                    </p>
                  )}
                  {article.author_name && (
                    <p className="mt-2">
                      <strong>Auteur:</strong>{' '}
                      <span>{article.author_name}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Sidebar with Infobox and TOC */}
            <aside className="w-64 flex-shrink-0">
              {article.article_type === 'mosque' && article.mosque_data ? (
                <MosqueInfobox mosque={article.mosque_data} />
              ) : article.article_type === 'imam' && article.imam_data ? (
                <ImamInfobox imam={article.imam_data} />
              ) : article.infobox ? (
                <Infobox
                  title={article.infobox.title || article.title}
                  headerColor={article.infobox.headerColor}
                  image={article.infobox.image}
                  sections={article.infobox.sections}
                />
              ) : null}
              {toc.length > 0 && <TableOfContents items={toc} />}
            </aside>
          </div>
        </main>
      </div>
      <WikiFooter />
    </div>
  )
}
