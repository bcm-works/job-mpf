// Soft-remove a group (sets status to "removed").
//
// DELETE /api/groups/:id -> { id, removed: true }

import type { GroupRecord } from '@/server/types'
import { groupKey, softRemove, useKv } from '@/server/utils/store'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: 'A group id is required.' })
  }

  const kv = await useKv()
  const removed = await softRemove<GroupRecord>(kv, groupKey(id))
  if (!removed) {
    throw createError({ statusCode: 404, message: `No group found with id "${id}".` })
  }

  return { id, removed: true }
})
