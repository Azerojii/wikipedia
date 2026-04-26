import Image from 'next/image'
import { getGlobalViewsByCountry } from '@/lib/wiki'

function getTwemojiUrl(code: string): string {
  const upper = code.toUpperCase()
  const cp1 = (0x1f1e6 + upper.charCodeAt(0) - 65).toString(16)
  const cp2 = (0x1f1e6 + upper.charCodeAt(1) - 65).toString(16)
  return `https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/${cp1}-${cp2}.svg`
}

export default async function FlagCounter() {
  const countries = await getGlobalViewsByCountry()
  if (countries.length === 0) return null

  const total = countries.reduce((sum, c) => sum + c.viewCount, 0)

  return (
    <div className="border-t border-gray-200 pt-4 mt-2 w-full">
      <p className="text-xs text-gray-500 text-center mb-3 font-semibold">Visiteurs par pays</p>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
        {countries.map(c => (
          <div key={c.countryCode} className="flex items-center gap-1.5 text-xs text-gray-500" title={c.countryName}>
            <Image
              src={getTwemojiUrl(c.countryCode)}
              alt={c.countryName}
              width={20}
              height={20}
              className="inline-block"
              unoptimized
            />
            <span className="font-semibold text-primary">{c.viewCount.toLocaleString('fr-FR')}</span>
            <span className="text-gray-400">{c.countryName}</span>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-400 text-center mt-2">
        {countries.length} pays · {total.toLocaleString('fr-FR')} vues
      </p>
    </div>
  )
}
