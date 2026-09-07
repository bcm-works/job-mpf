// List active lists for the default user.
//
// GET /api/lists -> { count, results: ListRecord[] }

import type { ListRecord } from '@/server/types'
import { listActive, useKv } from '@/server/utils/store'

export default defineEventHandler(async () => {
  const kv = await useKv()
  const lists = await listActive<ListRecord>(kv, 'list')
  lists.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  return { count: lists.length, results: lists }
})
