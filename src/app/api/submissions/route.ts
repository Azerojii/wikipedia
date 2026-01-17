import { NextResponse } from 'next/server'
import { createOrUpdateGitHubFile } from '@/lib/github'
import matter from 'gray-matter'
import fs from 'fs'
import path from 'path'

const pendingDirectory = path.join(process.cwd(), 'content/pending')

// Get all pending submissions
export async function GET() {
  try {
    if (!fs.existsSync(pendingDirectory)) {
      fs.mkdirSync(pendingDirectory, { recursive: true })
      return NextResponse.json({ submissions: [] })
    }

    const files = fs.readdirSync(pendingDirectory)
    const submissions = files
      .filter(file => file.endsWith('.md'))
      .map(file => {
        const fullPath = path.join(pendingDirectory, file)
        const fileContents = fs.readFileSync(fullPath, 'utf8')
        const { data, content } = matter(fileContents)
        
        return {
          id: file.replace('.md', ''),
          title: data.title,
          description: data.description,
          category: data.category,
          submittedAt: data.submittedAt,
          submitterName: data.submitterName,
          submitterEmail: data.submitterEmail,
        }
      })
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())

    return NextResponse.json({ submissions })
  } catch (error) {
    console.error('Error fetching submissions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    )
  }
}

// Create a new submission
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, description, category, content, submitterName, submitterEmail, infobox, youtubeVideos } = body

    if (!title || !content || !submitterName || !submitterEmail) {
      return NextResponse.json(
        { error: 'Title, content, name, and email are required' },
        { status: 400 }
      )
    }

    // Create unique ID with timestamp
    const timestamp = Date.now()
    const slug = title.trim().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '')
    const id = `${timestamp}_${slug}`
    const fileName = `${id}.md`
    const filePath = `content/pending/${fileName}`

    // Create frontmatter
    const frontmatter = {
      title,
      description: description || '',
      category: category || 'Général',
      submittedAt: new Date().toISOString(),
      submitterName,
      submitterEmail,
      status: 'pending',
      ...(infobox && { infobox }),
      ...(youtubeVideos && youtubeVideos.length > 0 && { youtubeVideos }),
    }

    // Create markdown file with frontmatter
    const fileContent = matter.stringify(content, frontmatter)
    
    // Use GitHub API to save the file
    const result = await createOrUpdateGitHubFile(
      filePath,
      fileContent,
      `New submission: ${title}`
    )

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to save submission' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      id,
      message: 'Soumission enregistrée avec succès' 
    })
  } catch (error) {
    console.error('Error creating submission:', error)
    return NextResponse.json(
      { error: `Failed to create submission: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}

