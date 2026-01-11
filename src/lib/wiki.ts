import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const contentDirectory = path.join(process.cwd(), 'content/wiki')

export interface WikiArticle {
  slug: string
  title: string
  description: string
  lastUpdated: string
  category: string
  infobox?: {
    [key: string]: string
  }
  content: string
  rawContent: string
}

export interface WikiMetadata {
  slug: string
  title: string
  description: string
  category: string
}

/**
 * Parse WikiLinks [[Article Name]] and convert to Next.js links
 */
export function parseWikiLinks(content: string): string {
  // Replace [[Article Name]] with markdown links [Article Name](/wiki/Article_Name)
  return content.replace(/\[\[(.*?)\]\]/g, (match, articleName) => {
    const slug = articleName.trim().replace(/\s+/g, '_')
    return `[${articleName}](/wiki/${slug})`
  })
}

/**
 * Extract table of contents from markdown headers
 */
export interface TocItem {
  level: number
  text: string
  slug: string
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


/**
 * Get all wiki article slugs
 */
export function getAllWikiSlugs(): string[] {
  const fileNames = fs.readdirSync(contentDirectory)
  return fileNames.map((fileName) => fileName.replace(/\.md$/, ''))
}

/**
 * Get metadata for all articles (for search)
 */
export function getAllWikiMetadata(): WikiMetadata[] {
  const slugs = getAllWikiSlugs()
  return slugs.map((slug) => {
    const fullPath = path.join(contentDirectory, `${slug}.md`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data } = matter(fileContents)

    return {
      slug,
      title: String(data.title || ''),
      description: String(data.description || ''),
      category: String(data.category || ''),
    }
  })
}

/**
 * Get a single wiki article by slug
 */
export async function getWikiArticle(slug: string): Promise<WikiArticle | null> {
  try {
    // Decode URL-encoded characters (e.g., %C3%A9 → é)
    const decodedSlug = decodeURIComponent(slug)
    const fullPath = path.join(contentDirectory, `${decodedSlug}.md`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    // Parse frontmatter
    const { data, content } = matter(fileContents)

    // Process WikiLinks first
    const contentWithLinks = parseWikiLinks(content)

    return {
      slug: decodedSlug,
      title: data.title,
      description: data.description,
      lastUpdated: typeof data.lastUpdated === 'string' 
        ? data.lastUpdated 
        : data.lastUpdated instanceof Date 
          ? data.lastUpdated.toISOString().split('T')[0]
          : String(data.lastUpdated),
      category: data.category,
      infobox: data.infobox ? Object.fromEntries(
        Object.entries(data.infobox).map(([key, value]) => [key, String(value)])
      ) : undefined,
      content: contentWithLinks,
      rawContent: content,
    }
  } catch (error) {
    console.error(`Error loading article ${slug}:`, error)
    return null
  }
}

/**
 * Search articles by query
 */
export function searchArticles(query: string): WikiMetadata[] {
  const allArticles = getAllWikiMetadata()
  const lowerQuery = query.toLowerCase()

  return allArticles.filter(
    (article) =>
      article.title.toLowerCase().includes(lowerQuery) ||
      article.description.toLowerCase().includes(lowerQuery)
  )
}
