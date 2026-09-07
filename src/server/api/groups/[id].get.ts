// Get a group with its active movies.
//
// GET /api/groups/:id -> { group: GroupRecord, movies: MovieRecord[] }

import { kvPrefix } from '@/server/utils/kv'
import type { GroupRecord } from '@/server/types'
import { groupKey, resolveGroupMovies, useKv } from '@/server/utils/store'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: 'A group id is required.' })
  }

  const kv = await useKv()
  const entry = await kv.get<GroupRecord>([...kvPrefix, groupKey(id)])
  if (!entry.value || entry.value.status !== 'active') {
    throw createError({ statusCode: 404, message: `No group found with id "${id}".` })
  }

  const movies = await resolveGroupMovies(kv, entry.value)
  return { group: entry.value, movies }
})
