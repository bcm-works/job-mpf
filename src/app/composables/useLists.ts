// Lists data layer for the default (single) user.

import type { FavouriteMovie } from './useFavourites'

export interface MovieList {
  id: string
  title: string
  userId: string
  movieIds: string[]
  createdAt: string
  updatedAt: string
  status: 'active' | 'removed'
}

export function useLists() {
  const lists = useState<MovieList[]>('lists', () => [])
  const pending = useState<boolean>('lists-pending', () => false)
  const error = useState<string | null>('lists-error', () => null)

  async function fetchLists() {
    pending.value = true
    error.value = null
    try {
      const data = await $fetch<{ count: number, results: MovieList[] }>('/api/lists')
      lists.value = data.results ?? []
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Failed to load lists.'
    } finally {
      pending.value = false
    }
  }

  async function createList(title: string): Promise<MovieList> {
    const list = await $fetch<MovieList>('/api/lists', { method: 'POST', body: { title } })
    lists.value = [list, ...lists.value]
    return list
  }

  async function renameList(id: string, title: string): Promise<MovieList> {
    const list = await $fetch<MovieList>(`/api/lists/${id}`, { method: 'PATCH', body: { title } })
    lists.value = lists.value.map(item => item.id === id ? list : item)
    return list
  }

  async function deleteList(id: string) {
    await $fetch(`/api/lists/${id}`, { method: 'DELETE' })
    lists.value = lists.value.filter(item => item.id !== id)
  }

  async function fetchListDetail(id: string): Promise<{ list: MovieList, movies: FavouriteMovie[] }> {
    return await $fetch<{ list: MovieList, movies: FavouriteMovie[] }>(`/api/lists/${id}`)
  }

  async function addMovieToList(listId: string, moviedbId: number) {
    const data = await $fetch<{ list: MovieList }>(`/api/lists/${listId}/movies`, {
      method: 'POST',
      body: { moviedbId }
    })
    lists.value = lists.value.map(item => item.id === listId ? data.list : item)
    return data
  }

  async function removeMovieFromList(listId: string, moviedbId: number) {
    const data = await $fetch<{ list: MovieList }>(`/api/lists/${listId}/movies/${moviedbId}`, {
      method: 'DELETE'
    })
    lists.value = lists.value.map(item => item.id === listId ? data.list : item)
    return data
  }

  return { lists, pending, error, fetchLists, createList, renameList, deleteList, fetchListDetail, addMovieToList, removeMovieFromList }
}
