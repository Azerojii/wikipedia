import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getWikiArticle, getAllWikiSlugs, generateTableOfContents } from '@/lib/wiki'
import WikiHeader from '@/components/WikiHeader'
import WikiSidebar from '@/components/WikiSidebar'
import TableOfContents from '@/components/TableOfContents'
import Infobox from '@/components/Infobox'
import EditButton from '@/components/EditButton'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import YouTubeVideos from '@/components/YouTubeVideos'

// Dynamic rendering - always fetch fresh data
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateStaticParams() {
  const slugs = getAllWikiSlugs()
  return slugs.map((slug) => ({
    slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await getWikiArticle(slug)
  
  if (!article) {
    return {
      title: 'Article Not Found',
    }
  }

  return {
    title: `${article.title} - MuslimWiki`,
    description: article.description,
  }
}

export default async function WikiPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await getWikiArticle(slug)

  if (!article) {
    notFound()
  }

  const toc = generateTableOfContents(article.rawContent)

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
            <span>{article.category}</span>
            <span className="mx-2">›</span>
            <span className="text-gray-900">{article.title}</span>
          </div>

          {/* Edit Button for Admin */}
          <EditButton slug={slug} />

          {/* Article Title */}
          <h1 className="text-4xl font-serif font-bold border-b border-gray-300 pb-2 mb-4">
            {article.title}
          </h1>

          <div className="flex gap-6">
            <div className="flex-1">
              {/* Article Content */}
              <MarkdownRenderer content={article.content} />

              {/* YouTube Videos Section */}
              {article.youtubeVideos && article.youtubeVideos.length > 0 && (
                <YouTubeVideos videos={article.youtubeVideos} />
              )}

              {/* Footer */}
              <div className="mt-12 pt-6 border-t border-gray-300">
                <div className="text-sm text-gray-600">
                  <p>
                    <strong>Dernière mise à jour:</strong> {article.lastUpdated}
                  </p>
                  <p className="mt-2">
                    <strong>Catégorie:</strong>{' '}
                    <span className="text-primary">{article.category}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Right Sidebar with Infobox and TOC */}
            <aside className="w-64 flex-shrink-0">
              {article.infobox && (
                <Infobox
                  title={article.infobox.title || article.title}
                  headerColor={article.infobox.headerColor}
                  image={article.infobox.image}
                  sections={article.infobox.sections}
                />
              )}
              {toc.length > 0 && <TableOfContents items={toc} />}
            </aside>
          </div>
        </main>
      </div>
    </div>
  )
}
