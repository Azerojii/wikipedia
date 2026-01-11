import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <h2 className="text-2xl font-serif mb-4">Article introuvable</h2>
        <p className="text-gray-600 mb-8">
          L'article que vous recherchez n'existe pas dans MuslimWiki.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/"
            className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:opacity-90 transition"
          >
            Retour à l'accueil
          </Link>
          <Link
            href="/wiki/create"
            className="inline-block bg-secondary text-white px-6 py-3 rounded-lg hover:opacity-90 transition"
          >
            Créer un article
          </Link>
        </div>
      </div>
    </div>
  )
}
