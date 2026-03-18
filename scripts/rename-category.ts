import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { resolve } from 'path'

// Parse .env.local manually
const envPath = resolve(process.cwd(), '.env.local')
const envContent = readFileSync(envPath, 'utf-8')
for (const line of envContent.split('\n')) {
  const match = line.match(/^([^#=]+)=(.*)$/)
  if (match) process.env[match[1].trim()] = match[2].trim().replace(/^["']|["']$/g, '')
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const OLD_NAME = 'Sépultures'
const NEW_NAME = 'Morts Musulmans'

async function renameCategory() {
  // 1. Rename the category in wiki_categories
  const { data: existing, error: checkErr } = await supabase
    .from('wiki_categories')
    .select('*')
    .eq('name', OLD_NAME)
    .maybeSingle()

  if (checkErr) {
    console.error('Error checking category:', checkErr.message)
    return
  }

  if (existing) {
    // Check if new name already exists
    const { data: newExists } = await supabase
      .from('wiki_categories')
      .select('*')
      .eq('name', NEW_NAME)
      .maybeSingle()

    if (newExists) {
      // New name exists, just delete the old one
      console.log(`"${NEW_NAME}" already exists, deleting old "${OLD_NAME}"...`)
      await supabase.from('wiki_categories').delete().eq('name', OLD_NAME)
    } else {
      // Rename
      const { error: renameErr } = await supabase
        .from('wiki_categories')
        .update({ name: NEW_NAME })
        .eq('name', OLD_NAME)
      if (renameErr) {
        console.error('Error renaming category:', renameErr.message)
        return
      }
      console.log(`Renamed category "${OLD_NAME}" → "${NEW_NAME}"`)
    }
  } else {
    console.log(`Category "${OLD_NAME}" not found, checking if "${NEW_NAME}" exists...`)
    const { data: newExists } = await supabase
      .from('wiki_categories')
      .select('*')
      .eq('name', NEW_NAME)
      .maybeSingle()
    if (newExists) {
      console.log(`"${NEW_NAME}" already exists. Nothing to do.`)
    } else {
      const { error } = await supabase.from('wiki_categories').insert({ name: NEW_NAME })
      if (error) console.error('Error creating category:', error.message)
      else console.log(`Created category "${NEW_NAME}"`)
    }
  }

  // 2. Update all articles that have "Sépultures" in their categories array
  const { data: articles, error: artErr } = await supabase
    .from('wiki_articles')
    .select('id, categories')
    .contains('categories', [OLD_NAME])

  if (artErr) {
    console.error('Error fetching articles:', artErr.message)
    return
  }

  if (articles && articles.length > 0) {
    console.log(`Found ${articles.length} articles with "${OLD_NAME}" category`)
    for (const article of articles) {
      const newCategories = (article.categories as string[]).map(
        (c: string) => c === OLD_NAME ? NEW_NAME : c
      )
      const { error: updateErr } = await supabase
        .from('wiki_articles')
        .update({ categories: newCategories })
        .eq('id', article.id)
      if (updateErr) {
        console.error(`Error updating article ${article.id}:`, updateErr.message)
      }
    }
    console.log('Updated article categories.')
  } else {
    console.log('No articles found with old category name.')
  }

  // 3. Update submissions too
  const { data: submissions, error: subErr } = await supabase
    .from('wiki_submissions')
    .select('id, categories')
    .contains('categories', [OLD_NAME])

  if (!subErr && submissions && submissions.length > 0) {
    console.log(`Found ${submissions.length} submissions with "${OLD_NAME}" category`)
    for (const sub of submissions) {
      const newCategories = (sub.categories as string[]).map(
        (c: string) => c === OLD_NAME ? NEW_NAME : c
      )
      await supabase
        .from('wiki_submissions')
        .update({ categories: newCategories })
        .eq('id', sub.id)
    }
    console.log('Updated submission categories.')
  }

  console.log('Done!')
}

renameCategory()
