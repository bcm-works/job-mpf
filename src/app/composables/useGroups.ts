// Groups data layer for the default (single) user.

import type { FavouriteMovie } from './useFavourites'

export interface Group {
  id: string
  title: string
  userId: string
  movieIds: string[]
  createdAt: string
  updatedAt: string
  status: 'active' | 'removed'
}

export function useGroups() {
  const groups = useState<Group[]>('groups', () => [])
  const pending = useState<boolean>('groups-pending', () => false)
  const error = useState<string | null>('groups-error', () => null)

  async function fetchGroups() {
    pending.value = true
    error.value = null
    try {
      const data = await $fetch<{ count: number, results: Group[] }>('/api/groups')
      groups.value = data.results ?? []
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Failed to load groups.'
    } finally {
      pending.value = false
    }
  }

  async function createGroup(title: string): Promise<Group> {
    const group = await $fetch<Group>('/api/groups', { method: 'POST', body: { title } })
    groups.value = [group, ...groups.value]
    return group
  }

  async function renameGroup(id: string, title: string): Promise<Group> {
    const group = await $fetch<Group>(`/api/groups/${id}`, { method: 'PATCH', body: { title } })
    groups.value = groups.value.map(item => item.id === id ? group : item)
    return group
  }

  async function deleteGroup(id: string) {
    await $fetch(`/api/groups/${id}`, { method: 'DELETE' })
    groups.value = groups.value.filter(item => item.id !== id)
  }

  async function fetchGroupDetail(id: string): Promise<{ group: Group, movies: FavouriteMovie[] }> {
    return await $fetch<{ group: Group, movies: FavouriteMovie[] }>(`/api/groups/${id}`)
  }

  async function addMovieToGroup(groupId: string, moviedbId: number) {
    const data = await $fetch<{ group: Group }>(`/api/groups/${groupId}/movies`, {
      method: 'POST',
      body: { moviedbId }
    })
    groups.value = groups.value.map(item => item.id === groupId ? data.group : item)
    return data
  }

  async function removeMovieFromGroup(groupId: string, moviedbId: number) {
    const data = await $fetch<{ group: Group }>(`/api/groups/${groupId}/movies/${moviedbId}`, {
      method: 'DELETE'
    })
    groups.value = groups.value.map(item => item.id === groupId ? data.group : item)
    return data
  }

  return { groups, pending, error, fetchGroups, createGroup, renameGroup, deleteGroup, fetchGroupDetail, addMovieToGroup, removeMovieFromGroup }
}
