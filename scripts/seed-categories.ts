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

const categories = ['Imams', 'Mosquées', 'Sépultures']

async function seed() {
  for (const name of categories) {
    const { error } = await supabase
      .from('wiki_categories')
      .insert({ name })
      .select()
    if (error) {
      if (error.code === '23505') {
        console.log(`Category "${name}" already exists, skipping.`)
      } else {
        console.error(`Error inserting "${name}":`, error.message)
      }
    } else {
      console.log(`Created category: ${name}`)
    }
  }
}

seed()
