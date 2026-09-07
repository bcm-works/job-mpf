// List favourite movies for the default user (active records only).
//
// GET /api/favourites -> { count, results: MovieRecord[] }

import { kvPrefix } from '@/server/utils/kv'
import type { FavouriteRecord, MovieRecord } from '@/server/types'
import { listActive, useKv } from '@/server/utils/store'

export default defineEventHandler(async () => {
  const kv = await useKv()
  const favourites = await listActive<FavouriteRecord>(kv, 'favourite')

  const results: MovieRecord[] = []
  for (const fav of favourites) {
    const entry = await kv.get<MovieRecord>([...kvPrefix, fav.movieId])
    if (entry.value && entry.value.status === 'active') {
      results.push(entry.value)
    }
  }

  return { count: results.length, results }
})
