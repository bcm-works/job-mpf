// List active groups for the default user.
//
// GET /api/groups -> { count, results: GroupRecord[] }

import type { GroupRecord } from '@/server/types'
import { listActive, useKv } from '@/server/utils/store'

export default defineEventHandler(async () => {
  const kv = await useKv()
  const groups = await listActive<GroupRecord>(kv, 'group')
  groups.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  return { count: groups.length, results: groups }
})
