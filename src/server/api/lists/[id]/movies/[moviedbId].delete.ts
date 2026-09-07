// Remove a movie from a list (idempotent, list stays active).
//
// DELETE /api/lists/:id/movies/:moviedbId -> { list, removed: moviedbId }

import { kvPrefix } from '@/server/utils/kv'
import type { ListRecord } from '@/server/types'
import { listKey, movieKey, now, useKv } from '@/server/utils/store'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const rawMovieId = getRouterParam(event, 'moviedbId')
  const moviedbId = Number(rawMovieId)
  if (!id) {
    throw createError({ statusCode: 400, message: 'A list id is required.' })
  }
  if (!rawMovieId || !Number.isInteger(moviedbId) || moviedbId <= 0) {
    throw createError({ statusCode: 400, message: 'A numeric moviedbId is required.' })
  }

  const kv = await useKv()
  const key = [...kvPrefix, listKey(id)]
  const entry = await kv.get<ListRecord>(key)
  if (!entry.value || entry.value.status !== 'active') {
    throw createError({ statusCode: 404, message: `No list found with id "${id}".` })
  }

  const list: ListRecord = {
    ...entry.value,
    movieIds: entry.value.movieIds.filter(movieId => movieId !== movieKey(moviedbId)),
    updatedAt: now()
  }
  await kv.set(key, list)

  return { list, removed: moviedbId }
})
