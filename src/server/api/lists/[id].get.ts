// Get a list with its active movies.
//
// GET /api/lists/:id -> { list: ListRecord, movies: MovieRecord[] }

import { kvPrefix } from '@/server/utils/kv'
import type { ListRecord } from '@/server/types'
import { listKey, resolveListMovies, useKv } from '@/server/utils/store'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: 'A list id is required.' })
  }

  const kv = await useKv()
  const entry = await kv.get<ListRecord>([...kvPrefix, listKey(id)])
  if (!entry.value || entry.value.status !== 'active') {
    throw createError({ statusCode: 404, message: `No list found with id "${id}".` })
  }

  const movies = await resolveListMovies(kv, entry.value)
  return { list: entry.value, movies }
})
