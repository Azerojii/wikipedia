import Link from 'next/link'
import WikiHeader from '@/components/WikiHeader'
import WikiFooter from '@/components/WikiFooter'
import CategoryArticleList from '@/components/CategoryArticleList'
import { getArticlesByCategory } from '@/lib/wiki'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function CategoryPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params
  const categoryName = decodeURIComponent(name)

  const articles = await getArticlesByCategory(categoryName)

  return (
    <main className="min-h-screen bg-gray-200">
      <WikiHeader />
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-serif font-bold mb-2">{categoryName}</h1>
        <p className="text-gray-600 mb-8">
          {articles.length} article(s) dans cette catégorie
        </p>

        <CategoryArticleList articles={articles} />

        <div className="mt-8">
          <Link href="/" className="text-primary hover:underline">
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
      <WikiFooter />
    </main>
  )
}
