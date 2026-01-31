import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import fs from 'fs'
import path from 'path'

const categoriesFilePath = path.join(process.cwd(), 'content', 'categories.json')

// Initialize categories file if it doesn't exist
function initializeCategoriesFile() {
  if (!fs.existsSync(categoriesFilePath)) {
    const defaultCategories = ['Histoire', 'Architecture', 'Culture', 'Religion', 'Général']
    fs.writeFileSync(categoriesFilePath, JSON.stringify(defaultCategories, null, 2))
  }
}

// Get all categories
export async function GET() {
  try {
    initializeCategoriesFile()
    const data = fs.readFileSync(categoriesFilePath, 'utf8')
    const categories = JSON.parse(data)
    return NextResponse.json({ categories })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

// Add or remove categories (admin only)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { action, category } = await request.json()
    
    if (!action || !category) {
      return NextResponse.json(
        { error: 'Action and category are required' },
        { status: 400 }
      )
    }

    initializeCategoriesFile()
    const data = fs.readFileSync(categoriesFilePath, 'utf8')
    let categories: string[] = JSON.parse(data)

    if (action === 'add') {
      if (!categories.includes(category)) {
        categories.push(category)
        fs.writeFileSync(categoriesFilePath, JSON.stringify(categories, null, 2))
        return NextResponse.json({ success: true, categories })
      } else {
        return NextResponse.json(
          { error: 'Category already exists' },
          { status: 400 }
        )
      }
    } else if (action === 'remove') {
      categories = categories.filter(cat => cat !== category)
      fs.writeFileSync(categoriesFilePath, JSON.stringify(categories, null, 2))
      return NextResponse.json({ success: true, categories })
    } else {
      return NextResponse.json(
        { error: 'Invalid action. Use "add" or "remove"' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Error managing categories:', error)
    return NextResponse.json(
      { error: 'Failed to manage categories' },
      { status: 500 }
    )
  }
}
