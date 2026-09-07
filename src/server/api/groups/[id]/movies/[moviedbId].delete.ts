// Remove a movie from a group (idempotent, group stays active).
//
// DELETE /api/groups/:id/movies/:moviedbId -> { group, removed: moviedbId }

import { kvPrefix } from '@/server/utils/kv'
import type { GroupRecord } from '@/server/types'
import { groupKey, movieKey, now, useKv } from '@/server/utils/store'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const rawMovieId = getRouterParam(event, 'moviedbId')
  const moviedbId = Number(rawMovieId)
  if (!id) {
    throw createError({ statusCode: 400, message: 'A group id is required.' })
  }
  if (!rawMovieId || !Number.isInteger(moviedbId) || moviedbId <= 0) {
    throw createError({ statusCode: 400, message: 'A numeric moviedbId is required.' })
  }

  const kv = await useKv()
  const key = [...kvPrefix, groupKey(id)]
  const entry = await kv.get<GroupRecord>(key)
  if (!entry.value || entry.value.status !== 'active') {
    throw createError({ statusCode: 404, message: `No group found with id "${id}".` })
  }

  const group: GroupRecord = {
    ...entry.value,
    movieIds: entry.value.movieIds.filter(movieId => movieId !== movieKey(moviedbId)),
    updatedAt: now()
  }
  await kv.set(key, group)

  return { group, removed: moviedbId }
})
