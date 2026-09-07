// Add a movie to a list (idempotent).
//
// POST /api/lists/:id/movies { moviedbId } -> { list, movie }

import { kvPrefix } from '@/server/utils/kv'
import type { ListRecord } from '@/server/types'
import { assertMoviedbId, ensureMovieRecord, getActiveMovie, listKey, movieKey, now, useKv } from '@/server/utils/store'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: 'A list id is required.' })
  }

  const body = await readBody<{ moviedbId?: unknown }>(event)
  const moviedbId = Number(body?.moviedbId)
  assertMoviedbId(moviedbId)

  const kv = await useKv()
  const key = [...kvPrefix, listKey(id)]
  const entry = await kv.get<ListRecord>(key)
  if (!entry.value || entry.value.status !== 'active') {
    throw createError({ statusCode: 404, message: `No list found with id "${id}".` })
  }

  let movie = await getActiveMovie(kv, moviedbId)
  if (!movie) {
    const details = await getTmdbMovie(moviedbId, 'en-US')
    movie = await ensureMovieRecord(kv, {
      id: details.id,
      title: details.title,
      overview: details.overview,
      posterUrl: details.poster_path ? `https://image.tmdb.org/t/p/original${details.poster_path}` : null,
      releaseDate: details.release_date || null
    })
  }

  const movieId = movieKey(moviedbId)
  const movieIds = entry.value.movieIds.includes(movieId)
    ? entry.value.movieIds
    : [...entry.value.movieIds, movieId]
  const list: ListRecord = { ...entry.value, movieIds, updatedAt: now() }
  await kv.set(key, list)

  return { list, movie }
})
