import { notFound } from 'next/navigation'
import { getArticle } from '@/lib/wiki'
import WikiHeader from '@/components/WikiHeader'
import WikiFooter from '@/components/WikiFooter'
import WikiSidebar from '@/components/WikiSidebar'
import SuggestEditForm from './SuggestEditForm'

export const dynamic = 'force-dynamic'

export default async function SuggestEditPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await getArticle(slug)

  if (!article) notFound()

  return (
    <div className="min-h-screen bg-white">
      <WikiHeader />
      <div className="flex max-w-[1400px] mx-auto">
        <WikiSidebar />
        <main className="flex-1 px-4 md:px-6 py-6 max-w-[860px]">
          <h1 className="text-3xl font-serif font-bold mb-1">Suggérer une modification</h1>
          <p className="text-gray-500 text-sm mb-6">Article : <span className="font-medium text-gray-700">{article.title}</span></p>

          <div className="bg-wiki-bg border border-wiki-border rounded-lg p-6">
            <SuggestEditForm slug={slug} articleTitle={article.title} currentContent={article.content} />
          </div>
        </main>
      </div>
      <WikiFooter />
    </div>
  )
}
