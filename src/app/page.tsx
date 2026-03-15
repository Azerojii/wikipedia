import Link from 'next/link'
import Image from 'next/image'
import WikiHeader from '@/components/WikiHeader'
import AllArticlesList from '@/components/AllArticlesList'
import WikiFooter from '@/components/WikiFooter'
import { Plus } from 'lucide-react'
import { getAllArticles, getAllCategories } from '@/lib/wiki'

export const dynamic = 'force-dynamic'
export const revalidate = 0

function isNewArticle(date: string): boolean {
  const articleDate = new Date(date)
  const threeDaysAgo = new Date()
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)
  return articleDate >= threeDaysAgo
}

export default async function Home() {
  const [articles, categories] = await Promise.all([getAllArticles(), getAllCategories()])

  const categoryData = categories.map(cat => {
    const categoryArticles = articles.filter(a => a.categories?.includes(cat.name))
    const hasNewArticles = categoryArticles.some(a => isNewArticle(a.updated_at))
    return { name: cat.name, hasNewArticles }
  })

  return (
    <main className="min-h-screen bg-[#f5f6f8]">
      <WikiHeader />
      <div className="max-w-4xl mx-auto px-4 py-6 md:py-12">
        {/* Hero Section */}
        <div className="text-center mb-10 bg-white rounded-xl border border-gray-200 px-6 py-8 md:py-10 shadow-sm">
          <div className="flex flex-wrap items-center justify-center gap-4 mb-4">
            <Image
              src="/logo.png"
              alt="Musulmans Français Logo"
              width={100}
              height={100}
              className="object-contain"
            />
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-primary">Musulmans Français</h1>
            <Image
              src="/logofrance.png"
              alt="France"
              width={80}
              height={80}
              className="object-contain"
            />
          </div>
          <p className="text-lg md:text-xl text-gray-600">L'encyclopédie libre sur la Grande Mosquée de Paris</p>
          <p className="text-base md:text-lg text-gray-700 mt-3 italic max-w-2xl mx-auto">
            À l'occasion du centenaire de la Grande Mosquée de Paris,
            en hommage à celles et ceux qui ont cru en la coexistence durable entre l'islam et la France.
          </p>
        </div>

        {/* Categories Section */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-serif font-bold">Catégories</h2>
          <Link
            href="/submit"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:opacity-90 transition-colors shadow-sm"
            title="Ajouter un article"
          >
            <Plus size={14} />
            Ajouter
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {categoryData.length > 0 ? (
            categoryData.map((category) => (
              <Link
                key={category.name}
                href={`/category/${encodeURIComponent(category.name)}`}
                className="group p-5 bg-white border border-gray-200 rounded-xl hover:border-primary/30 hover:shadow-md transition-all duration-200"
              >
                <h3 className="text-lg font-bold text-primary group-hover:text-primary/80 transition-colors">{category.name}</h3>
                {category.hasNewArticles && (
                  <span className="inline-block mt-2 px-2.5 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                    Nouveaux articles
                  </span>
                )}
              </Link>
            ))
          ) : (
            <div className="col-span-3 text-center py-8">
              <p className="text-gray-600">Aucune catégorie disponible.</p>
            </div>
          )}
        </div>

        <AllArticlesList articles={articles} />

        <div className="mt-10 text-center text-sm text-gray-400">
          <p>Musulmans Français contient {articles.length} article(s) sur la Grande Mosquée de Paris</p>
        </div>
      </div>
      <WikiFooter />
    </main>
  )
}
