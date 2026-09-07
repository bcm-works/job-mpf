// Create a list for the default user.
//
// POST /api/lists { title } -> 201 ListRecord

import { kvPrefix } from '@/server/utils/kv'
import type { ListRecord } from '@/server/types'
import { DEFAULT_USER_ID, listKey, now, useKv } from '@/server/utils/store'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ title?: unknown }>(event)
  const title = typeof body?.title === 'string' ? body.title.trim() : ''
  if (!title || title.length > 80) {
    throw createError({ statusCode: 400, message: 'A list title of 1-80 characters is required.' })
  }

  const id = crypto.randomUUID()
  const timestamp = now()
  const list: ListRecord = {
    id,
    title,
    userId: DEFAULT_USER_ID,
    movieIds: [],
    createdAt: timestamp,
    updatedAt: timestamp,
    status: 'active'
  }

  const kv = await useKv()
  await kv.set([...kvPrefix, listKey(id)], list)

  event.node.res.statusCode = 201
  return list
})
