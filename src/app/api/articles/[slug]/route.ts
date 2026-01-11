import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { getWikiArticle } from '@/lib/wiki'

const contentDirectory = path.join(process.cwd(), 'content/wiki')

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const decodedSlug = decodeURIComponent(params.slug)
    const article = await getWikiArticle(decodedSlug)
    
    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(article)
  } catch (error) {
    console.error('Error fetching article:', error)
    return NextResponse.json(
      { error: 'Failed to fetch article' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const body = await request.json()
    const { title, description, category, content, infobox, youtubeVideos } = body

    // Validate required fields
    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

    const decodedSlug = decodeURIComponent(params.slug)
    const filePath = path.join(contentDirectory, `${decodedSlug}.md`)

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      )
    }

    // Create frontmatter
    const frontmatter = {
      title,
      description: description || '',
      lastUpdated: new Date().toISOString().split('T')[0],
      category: category || 'General',
      ...(infobox && { infobox }),
      ...(youtubeVideos && youtubeVideos.length > 0 && { youtubeVideos }),
    }

    // Create markdown file with frontmatter
    const fileContent = matter.stringify(content, frontmatter)

    // Write file
    fs.writeFileSync(filePath, fileContent, 'utf8')

    return NextResponse.json({ 
      success: true, 
      slug: decodedSlug,
      message: 'Article updated successfully' 
    })
  } catch (error) {
    console.error('Error updating article:', error)
    return NextResponse.json(
      { error: 'Failed to update article' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const decodedSlug = decodeURIComponent(params.slug)
    const filePath = path.join(contentDirectory, `${decodedSlug}.md`)

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      )
    }

    // Delete file
    fs.unlinkSync(filePath)

    return NextResponse.json({ 
      success: true,
      message: 'Article deleted successfully' 
    })
  } catch (error) {
    console.error('Error deleting article:', error)
    return NextResponse.json(
      { error: 'Failed to delete article' },
      { status: 500 }
    )
  }
}

