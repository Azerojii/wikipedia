import { supabase } from './supabase'
import type { MosqueData, ImamData, BurialData } from '@/types/mosque'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Reference {
  id: string
  author?: string
  title: string
  year?: string
  url?: string
  publisher?: string
  accessDate?: string
}

export interface InfoboxSection {
  title?: string
  items: {
    label: string
    value: string
    isDate?: boolean
    isLink?: boolean
  }[]
}

export interface InfoboxData {
  title?: string
  headerColor?: string
  image?: {
    src: string
    caption: string
  }
  sections: InfoboxSection[]
}

export interface WikiArticle {
  id: string
  slug: string
  title: string
  content: string
  excerpt: string
  article_type: string
  infobox?: InfoboxData | null
  mosque_data?: MosqueData | null
  imam_data?: ImamData | null
  burial_data?: BurialData | null
  references?: Reference[] | null
  image_url?: string | null
  categories: string[]
  author_name?: string | null
  created_at: string
  updated_at: string
}

export interface WikiSubmission {
  id: string
  slug?: string | null
  title: string
  content?: string | null
  excerpt?: string | null
  article_type: string
  infobox?: InfoboxData | null
  mosque_data?: MosqueData | null
  imam_data?: ImamData | null
  burial_data?: BurialData | null
  references?: Reference[] | null
  image_url?: string | null
  categories?: string[] | null
  author_name?: string | null
  status: string
  submitted_at: string
  reviewed_at?: string | null
}

export interface WikiCategory {
  id: string
  name: string
  created_at: string
}

export interface WikiEditSuggestion {
  id: string
  article_slug: string
  article_title: string
  suggested_content: string
  suggested_title?: string | null
  suggested_excerpt?: string | null
  suggested_categories?: string[] | null
  reason?: string | null
  suggester_name?: string | null
  status: string
  submitted_at: string
  reviewed_at?: string | null
}

// ─── Utility helpers kept from original ───────────────────────────────────────

export interface TocItem {
  level: number
  text: string
  slug: string
}

export function parseWikiLinks(content: string): string {
  return content.replace(/\[\[(.*?)\]\]/g, (match, articleName) => {
    const slug = articleName.trim().replace(/\s+/g, '_')
    return `[${articleName}](/wiki/${slug})`
  })
}

export function generateTableOfContents(content: string): TocItem[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm
  const toc: TocItem[] = []
  let match

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length
    const text = match[2]
    const slug = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')

    toc.push({ level, text, slug })
  }

  return toc
}

// ─── Article CRUD ─────────────────────────────────────────────────────────────

export async function getArticle(slug: string): Promise<WikiArticle | null> {
  try {
    const decodedSlug = decodeURIComponent(slug)
    const { data, error } = await supabase
      .from('wiki_articles')
      .select('*')
      .eq('slug', decodedSlug)
      .maybeSingle()

    if (error || !data) return null
    return data as WikiArticle
  } catch (error) {
    console.error(`Error loading article ${slug}:`, error)
    return null
  }
}

export async function getAllArticles(): Promise<WikiArticle[]> {
  const { data, error } = await supabase
    .from('wiki_articles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error || !data) return []
  return data as WikiArticle[]
}

export async function getArticlesByCategory(category: string): Promise<WikiArticle[]> {
  const { data, error } = await supabase
    .from('wiki_articles')
    .select('*')
    .contains('categories', [category])
    .order('created_at', { ascending: false })

  if (error || !data) return []
  return data as WikiArticle[]
}

export async function createArticle(
  articleData: Omit<WikiArticle, 'id' | 'created_at' | 'updated_at'>
): Promise<WikiArticle | null> {
  const { data, error } = await supabase
    .from('wiki_articles')
    .insert(articleData)
    .select()
    .single()

  if (error || !data) {
    console.error('Error creating article:', error)
    return null
  }
  return data as WikiArticle
}

export async function updateArticle(
  slug: string,
  updates: Partial<Omit<WikiArticle, 'id' | 'created_at' | 'updated_at'>>
): Promise<WikiArticle | null> {
  const { data, error } = await supabase
    .from('wiki_articles')
    .update(updates)
    .eq('slug', slug)
    .select()
    .single()

  if (error || !data) {
    console.error('Error updating article:', error)
    return null
  }
  return data as WikiArticle
}

export async function deleteArticle(slug: string): Promise<boolean> {
  const { error } = await supabase
    .from('wiki_articles')
    .delete()
    .eq('slug', slug)

  if (error) {
    console.error('Error deleting article:', error)
    return false
  }
  return true
}

export async function searchArticles(query: string): Promise<WikiArticle[]> {
  // Try full-text search first
  const { data: ftsData, error: ftsError } = await supabase
    .from('wiki_articles')
    .select('*')
    .textSearch('search_vector', query, { type: 'websearch', config: 'french' })
    .order('created_at', { ascending: false })

  if (!ftsError && ftsData && ftsData.length > 0) {
    return ftsData as WikiArticle[]
  }

  // Fallback to ilike
  const { data, error } = await supabase
    .from('wiki_articles')
    .select('*')
    .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
    .order('created_at', { ascending: false })

  if (error || !data) return []
  return data as WikiArticle[]
}

// ─── Category CRUD ────────────────────────────────────────────────────────────

export async function getAllCategories(): Promise<WikiCategory[]> {
  const { data, error } = await supabase
    .from('wiki_categories')
    .select('*')
    .order('name')

  if (error || !data) return []
  return data as WikiCategory[]
}

export async function createCategory(name: string): Promise<WikiCategory | null> {
  const { data, error } = await supabase
    .from('wiki_categories')
    .insert({ name })
    .select()
    .single()

  if (error || !data) {
    console.error('Error creating category:', error)
    return null
  }
  return data as WikiCategory
}

export async function deleteCategory(name: string): Promise<boolean> {
  const { error } = await supabase
    .from('wiki_categories')
    .delete()
    .eq('name', name)

  if (error) {
    console.error('Error deleting category:', error)
    return false
  }
  return true
}

// ─── Submission CRUD ──────────────────────────────────────────────────────────

export async function getSubmissions(status?: string): Promise<WikiSubmission[]> {
  let query = supabase
    .from('wiki_submissions')
    .select('*')
    .order('submitted_at', { ascending: false })

  if (status) {
    query = query.eq('status', status)
  }

  const { data, error } = await query
  if (error || !data) return []
  return data as WikiSubmission[]
}

export async function getSubmission(id: string): Promise<WikiSubmission | null> {
  const { data, error } = await supabase
    .from('wiki_submissions')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error || !data) return null
  return data as WikiSubmission
}

export async function createSubmission(
  submissionData: Omit<WikiSubmission, 'id' | 'submitted_at' | 'reviewed_at' | 'status'>
): Promise<WikiSubmission | null> {
  const { data, error } = await supabase
    .from('wiki_submissions')
    .insert(submissionData)
    .select()
    .single()

  if (error || !data) {
    console.error('Error creating submission:', error)
    return null
  }
  return data as WikiSubmission
}

export async function updateSubmissionStatus(
  id: string,
  status: string
): Promise<WikiSubmission | null> {
  const { data, error } = await supabase
    .from('wiki_submissions')
    .update({ status, reviewed_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error || !data) {
    console.error('Error updating submission status:', error)
    return null
  }
  return data as WikiSubmission
}

// ─── Edit Suggestion CRUD ─────────────────────────────────────────────────────

export async function getEditSuggestions(status?: string): Promise<WikiEditSuggestion[]> {
  let query = supabase
    .from('wiki_edit_suggestions')
    .select('*')
    .order('submitted_at', { ascending: false })

  if (status) {
    query = query.eq('status', status)
  }

  const { data, error } = await query
  if (error || !data) return []
  return data as WikiEditSuggestion[]
}

export async function getEditSuggestion(id: string): Promise<WikiEditSuggestion | null> {
  const { data, error } = await supabase
    .from('wiki_edit_suggestions')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error || !data) return null
  return data as WikiEditSuggestion
}

export async function createEditSuggestion(data: {
  article_slug: string
  article_title: string
  suggested_content: string
  suggested_title?: string
  suggested_excerpt?: string
  suggested_categories?: string[]
  reason?: string
  suggester_name?: string
}): Promise<WikiEditSuggestion | null> {
  const { data: result, error } = await supabase
    .from('wiki_edit_suggestions')
    .insert(data)
    .select()
    .single()

  if (error || !result) {
    console.error('Error creating edit suggestion:', error)
    return null
  }
  return result as WikiEditSuggestion
}

export async function updateEditSuggestionStatus(id: string, status: string): Promise<WikiEditSuggestion | null> {
  const { data, error } = await supabase
    .from('wiki_edit_suggestions')
    .update({ status, reviewed_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error || !data) {
    console.error('Error updating edit suggestion status:', error)
    return null
  }
  return data as WikiEditSuggestion
}

export async function updateSubmission(
  id: string,
  updates: Partial<Omit<WikiSubmission, 'id' | 'submitted_at'>>
): Promise<WikiSubmission | null> {
  const { data, error } = await supabase
    .from('wiki_submissions')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error || !data) {
    console.error('Error updating submission:', error)
    return null
  }
  return data as WikiSubmission
}

// ─── View Tracking ────────────────────────────────────────────────────────────

export interface ViewCount {
  countryCode: string
  countryName: string
  viewCount: number
}

export async function getMostViewedArticles(limit: number = 6): Promise<(WikiArticle & { viewCount: number })[]> {
  try {
    // Get top articles by view count
    const { data: viewData, error: viewError } = await supabase
      .from('wiki_article_view_counts')
      .select('slug')
      .order('view_count', { ascending: false })
      .limit(limit)

    if (viewError || !viewData) return []

    // Fetch full article data for each slug
    const articles = await Promise.all(
      viewData.map(async (vc) => {
        const article = await getArticle(vc.slug)
        return article
      })
    )

    // Get view counts for all slugs
    const slugs = viewData.map((vc) => vc.slug)
    const viewCounts = await getViewCountsBySlugs(slugs)

    return articles
      .filter((a) => a !== null)
      .map((a) => ({
        ...(a as WikiArticle),
        viewCount: viewCounts[a!.slug] || 0,
      }))
  } catch (error) {
    console.error('Error fetching most viewed articles:', error)
    return []
  }
}

export async function getViewCountsBySlugs(slugs: string[]): Promise<Record<string, number>> {
  if (slugs.length === 0) return {}

  try {
    const { data, error } = await supabase
      .from('wiki_article_view_counts')
      .select('slug, view_count')
      .in('slug', slugs)

    if (error || !data) return {}

    return data.reduce(
      (acc, vc) => {
        acc[vc.slug] = (acc[vc.slug] || 0) + vc.view_count
      },
      {} as Record<string, number>
    )
  } catch (error) {
    console.error('Error fetching view counts:', error)
    return {}
  }
}

export async function getGlobalViewsByCountry(): Promise<ViewCount[]> {
  try {
    const { data, error } = await supabase
      .from('wiki_article_view_counts')
      .select('country_code, country_name, view_count')
      .order('view_count', { ascending: false })

    if (error || !data) return []

    // Aggregate by country
    const countryMap = new Map<string, { name: string; total: number }>()
    data.forEach((row) => {
      const existing = countryMap.get(row.country_code)
      if (existing) {
        existing.total += row.view_count
      } else {
        countryMap.set(row.country_code, { name: row.country_name, total: row.view_count })
      }
    })

    return Array.from(countryMap.entries()).map(([code, { name, total }]) => ({
      countryCode: code,
      countryName: name,
      viewCount: total,
    }))
  } catch (error) {
    console.error('Error fetching global views by country:', error)
    return []
  }
}
