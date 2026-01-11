import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const contentDirectory = path.join(process.cwd(), 'content/wiki')

export async function POST(request: Request) {
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

    // Create slug from title (trim and replace spaces with underscores)
    const slug = title.trim().replace(/\s+/g, '_')
    const filePath = path.join(contentDirectory, `${slug}.md`)

    // Check if file already exists
    if (fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'Article already exists' },
        { status: 409 }
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

    // Ensure directory exists
    if (!fs.existsSync(contentDirectory)) {
      fs.mkdirSync(contentDirectory, { recursive: true })
    }

    // Write file
    fs.writeFileSync(filePath, fileContent, 'utf8')

    return NextResponse.json({ 
      success: true, 
      slug,
      message: 'Article created successfully' 
    })
  } catch (error) {
    console.error('Error creating article:', error)
    return NextResponse.json(
      { error: 'Failed to create article' },
      { status: 500 }
    )
  }
}
