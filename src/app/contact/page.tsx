import Link from 'next/link'
import { Mail, Globe2, Phone } from 'lucide-react'
import WikiHeader from '@/components/WikiHeader'
import WikiFooter from '@/components/WikiFooter'
import { getSupabase } from '@/lib/supabase'
import { normalizeFooterSettings } from '@/lib/footer'

export const dynamic = 'force-dynamic'

export default async function ContactPage() {
  let settings
  try {
    const supabase = getSupabase()
    const { data } = await supabase
      .from('wiki_settings')
      .select('value')
      .eq('key', 'footer')
      .maybeSingle()
    settings = normalizeFooterSettings(data?.value)
  } catch {
    settings = null
  }

  const contactItems = settings?.contactItems ?? []
  const socialLinks = settings?.socialLinks ?? []
  const friendlySites = settings?.friendlySites ?? []

  return (
    <div className="min-h-screen bg-[#f5f6f8]">
      <WikiHeader />
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
        <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
          <Link href="/" className="text-primary hover:underline">Accueil</Link>
          <span className="text-gray-300">›</span>
          <span className="text-gray-700">Contact</span>
        </nav>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm">
          <h1 className="text-3xl font-serif font-bold mb-2">Nous contacter</h1>
          <p className="text-gray-500">
            {settings?.description || "Retrouvez nos coordonnées et liens officiels ci-dessous."}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Contact details */}
          {contactItems.length > 0 && (
            <section className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Phone size={18} className="text-primary" />
                <h2 className="font-bold text-lg">Coordonnées</h2>
              </div>
              <div className="space-y-3">
                {contactItems.map((item, i) => (
                  <div key={i} className="border border-gray-100 rounded-lg px-4 py-3">
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{item.label}</div>
                    {item.url ? (
                      <a href={item.url} className="text-primary font-medium hover:underline text-sm">
                        {item.value}
                      </a>
                    ) : (
                      <div className="text-gray-700 text-sm font-medium">{item.value}</div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Social links */}
          {socialLinks.length > 0 && (
            <section className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Mail size={18} className="text-primary" />
                <h2 className="font-bold text-lg">Réseaux sociaux</h2>
              </div>
              <div className="space-y-3">
                {socialLinks.map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 border border-gray-100 rounded-lg px-4 py-3 hover:border-primary/30 hover:shadow-sm transition-all group"
                  >
                    <Globe2 size={16} className="text-primary" />
                    <span className="text-primary font-medium text-sm group-hover:underline">{link.label}</span>
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* Friendly sites */}
          {friendlySites.length > 0 && (
            <section className="bg-white border border-gray-200 rounded-xl p-5 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Globe2 size={18} className="text-primary" />
                <h2 className="font-bold text-lg">Sites officiels</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {friendlySites.map((site, i) => (
                  <a
                    key={i}
                    href={site.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 border border-gray-100 rounded-lg px-4 py-3 hover:border-primary/30 hover:shadow-sm transition-all group"
                  >
                    <Globe2 size={16} className="text-gray-400" />
                    <span className="text-primary font-medium text-sm group-hover:underline">{site.label}</span>
                  </a>
                ))}
              </div>
            </section>
          )}

          {contactItems.length === 0 && socialLinks.length === 0 && friendlySites.length === 0 && (
            <div className="md:col-span-2 text-center py-10 text-gray-400">
              <Phone size={32} className="mx-auto mb-3 opacity-40" />
              <p>Les informations de contact seront ajoutées prochainement.</p>
              <p className="text-sm mt-1">
                Elles peuvent être configurées depuis{' '}
                <Link href="/admin" className="text-primary hover:underline">le panneau d'administration</Link>.
              </p>
            </div>
          )}
        </div>
      </div>
      <WikiFooter />
    </div>
  )
}
