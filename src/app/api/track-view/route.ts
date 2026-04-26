import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { headers } from 'next/server'

const COUNTRY_NAMES: Record<string, string> = {
  DZ: 'Algérie',
  FR: 'France',
  MA: 'Maroc',
  TN: 'Tunisie',
  EG: 'Égypte',
  SA: 'Arabie Saoudite',
  AE: 'Émirats Arabes Unis',
  QA: 'Qatar',
  KW: 'Koweït',
  LY: 'Libye',
  MR: 'Mauritanie',
  SD: 'Soudan',
  TR: 'Turquie',
  DE: 'Allemagne',
  GB: 'Royaume-Uni',
  US: 'États-Unis',
  CA: 'Canada',
  BE: 'Belgique',
  NL: 'Pays-Bas',
  IT: 'Italie',
  ES: 'Espagne',
}

export async function POST(request: Request) {
  try {
    const { slug } = await request.json()
    if (!slug || typeof slug !== 'string') {
      return NextResponse.json({ error: 'Invalid slug' }, { status: 400 })
    }

    const headersList = await headers()
    const countryCode = headersList.get('x-vercel-ip-country') || headersList.get('cf-ipcountry') || 'XX'
    const countryName = COUNTRY_NAMES[countryCode] || countryCode

    const supabase = getSupabase()

    // Check if entry exists
    const { data: existing } = await supabase
      .from('wiki_article_view_counts')
      .select('view_count')
      .eq('slug', slug)
      .eq('country_code', countryCode)
      .maybeSingle()

    if (existing) {
      await supabase
        .from('wiki_article_view_counts')
        .update({ view_count: (existing.view_count as number) + 1 })
        .eq('slug', slug)
        .eq('country_code', countryCode)
    } else {
      await supabase.from('wiki_article_view_counts').insert({
        slug,
        country_code: countryCode,
        country_name: countryName,
        view_count: 1,
      })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Error tracking view:', error)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
