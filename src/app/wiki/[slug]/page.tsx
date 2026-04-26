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
import BurialInfobox from '@/components/BurialInfobox'
import SuggestEditButton from '@/components/SuggestEditButton'
import PrintButton from '@/components/PrintButton'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import ArticleReferences from '@/components/ArticleReferences'
import YouTubeVideos from '@/components/YouTubeVideos'
import ViewTracker from '@/components/ViewTracker'

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
    <div className="min-h-screen bg-[#f5f6f8]">
      <WikiHeader />
      <ViewTracker slug={slug} />

      <div className="flex max-w-[1400px] mx-auto">
        <WikiSidebar />

        <main className="flex-1 min-w-0 bg-white border-x border-gray-100">
          <div className="px-6 md:px-10 lg:px-14 py-6">
            {/* Breadcrumbs */}
            <nav className="text-sm text-gray-500 mb-4" aria-label="Fil d'Ariane">
              <Link href="/" className="text-primary hover:underline">
                Accueil
              </Link>
              <span className="mx-1.5 text-gray-300">›</span>
              {article.categories?.[0] && (
                <>
                  <Link href={`/category/${encodeURIComponent(article.categories[0])}`} className="text-primary hover:underline">
                    {article.categories[0]}
                  </Link>
                  <span className="mx-1.5 text-gray-300">›</span>
                </>
              )}
              <span className="text-gray-700">{article.title}</span>
            </nav>

            <div className="flex gap-2 flex-wrap mb-3">
              <SuggestEditButton slug={slug} currentContent={article.content} articleTitle={article.title} />
              <PrintButton />
            </div>

            <h1 className="text-3xl md:text-4xl font-serif font-bold border-b border-gray-200 pb-3 mb-6">
              {article.title}
            </h1>

            <div className="flex flex-col-reverse lg:flex-row gap-8">
              <div className="flex-1 min-w-0">
                <ArticleReferences content={article.content} references={article.references} />

                {/* Article metadata */}
                <div className="mt-12 pt-5 border-t border-gray-200">
                  <div className="text-sm text-gray-500 space-y-1.5">
                    <p>
                      <span className="font-medium text-gray-600">Dernière mise à jour :</span>{' '}
                      {new Date(article.updated_at).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                    {article.categories?.length > 0 && (
                      <p>
                        <span className="font-medium text-gray-600">Catégorie :</span>{' '}
                        <Link href={`/category/${encodeURIComponent(article.categories[0])}`} className="text-primary hover:underline">
                          {article.categories[0]}
                        </Link>
                      </p>
                    )}
                    {article.author_name && (
                      <p>
                        <span className="font-medium text-gray-600">Auteur :</span>{' '}
                        {article.author_name}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Sidebar with Infobox and TOC */}
              <aside className="w-full lg:w-[300px] lg:flex-shrink-0">
                {article.article_type === 'mosque' && article.mosque_data ? (
                  <MosqueInfobox mosque={article.mosque_data} />
                ) : article.article_type === 'imam' && article.imam_data ? (
                  <ImamInfobox imam={article.imam_data} />
                ) : article.article_type === 'burial' && article.burial_data ? (
                  <BurialInfobox burial={article.burial_data} />
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
          </div>
        </main>
      </div>
      <WikiFooter />
    </div>
  )
}
