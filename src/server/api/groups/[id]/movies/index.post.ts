// Add a movie to a group (idempotent).
//
// POST /api/groups/:id/movies { moviedbId } -> { group, movie }

import { kvPrefix } from '@/server/utils/kv'
import type { GroupRecord } from '@/server/types'
import { assertMoviedbId, ensureMovieRecord, getActiveMovie, groupKey, movieKey, now, useKv } from '@/server/utils/store'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: 'A group id is required.' })
  }

  const body = await readBody<{ moviedbId?: unknown }>(event)
  const moviedbId = Number(body?.moviedbId)
  assertMoviedbId(moviedbId)

  const kv = await useKv()
  const key = [...kvPrefix, groupKey(id)]
  const entry = await kv.get<GroupRecord>(key)
  if (!entry.value || entry.value.status !== 'active') {
    throw createError({ statusCode: 404, message: `No group found with id "${id}".` })
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
  const group: GroupRecord = { ...entry.value, movieIds, updatedAt: now() }
  await kv.set(key, group)

  return { group, movie }
})
