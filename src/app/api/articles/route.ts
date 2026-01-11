import { NextResponse } from 'next/server'
import matter from 'gray-matter'
import { createOrUpdateGitHubFile, fileExistsOnGitHub } from '@/lib/github'

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
    const filePath = `content/wiki/${slug}.md`

    // Check if file already exists
    const exists = await fileExistsOnGitHub(filePath)
    if (exists) {
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

    // Create file via GitHub API or local filesystem
    const result = await createOrUpdateGitHubFile(
      filePath,
      fileContent,
      `Create article: ${title}`
    )

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to create article' },
        { status: 500 }
      )
    }

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
