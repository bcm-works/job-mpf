// Soft-remove a favourite (sets status to "removed").
//
// DELETE /api/favourites/:id -> { id, removed: true }

import type { FavouriteRecord } from '@/server/types'
import { favouriteKey, softRemove, useKv } from '@/server/utils/store'

export default defineEventHandler(async (event) => {
  const rawId = getRouterParam(event, 'id')
  const moviedbId = Number(rawId)
  if (!rawId || !Number.isInteger(moviedbId) || moviedbId <= 0) {
    throw createError({ statusCode: 400, message: 'A numeric favourite id (moviedbId) is required.' })
  }

  const kv = await useKv()
  const removed = await softRemove<FavouriteRecord>(kv, favouriteKey(moviedbId))
  if (!removed) {
    throw createError({ statusCode: 404, message: `No favourite found for movie "${moviedbId}".` })
  }

  return { id: String(moviedbId), removed: true }
})
