// Soft-remove a list (sets status to "removed").
//
// DELETE /api/lists/:id -> { id, removed: true }

import type { ListRecord } from '@/server/types'
import { listKey, softRemove, useKv } from '@/server/utils/store'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: 'A list id is required.' })
  }

  const kv = await useKv()
  const removed = await softRemove<ListRecord>(kv, listKey(id))
  if (!removed) {
    throw createError({ statusCode: 404, message: `No list found with id "${id}".` })
  }

  return { id, removed: true }
})
