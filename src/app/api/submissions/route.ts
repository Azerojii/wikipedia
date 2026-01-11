import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

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
    const { title, description, category, content, submitterName, submitterEmail } = body

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

    // Ensure directory exists
    if (!fs.existsSync(pendingDirectory)) {
      fs.mkdirSync(pendingDirectory, { recursive: true })
    }

    // Create unique ID with timestamp
    const timestamp = Date.now()
    const slug = title.trim().replace(/\s+/g, '_')
    const id = `${timestamp}_${slug}`
    const filePath = path.join(pendingDirectory, `${id}.md`)

    // Create frontmatter
    const frontmatter = {
      title,
      description: description || '',
      category: category || 'Général',
      submittedAt: new Date().toISOString(),
      submitterName: submitterName || 'Anonyme',
      submitterEmail: submitterEmail || '',
      status: 'pending',
    }

    // Create markdown file with frontmatter
    const fileContent = matter.stringify(content, frontmatter)
    fs.writeFileSync(filePath, fileContent, 'utf8')

    return NextResponse.json({ 
      success: true, 
      id,
      message: 'Soumission enregistrée avec succès' 
    })
  } catch (error) {
    console.error('Error creating submission:', error)
    return NextResponse.json(
      { error: 'Failed to create submission' },
      { status: 500 }
    )
  }
}

