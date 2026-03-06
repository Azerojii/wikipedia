export interface MosqueData {
  name?: string
  headerColor?: string
  image?: { src: string; caption: string }
  localisation?: string
  constructionDate?: string
  inaugurationDate?: string
  capacity?: number
  prayerHallArea?: number
  totalArea?: number
  minaretHeight?: number
  architect?: string
  founders?: string
  facilities?: string[]
  gallery?: { src: string; caption: string }[]
}
