// Favourites data layer for the default (single) user.

export interface FavouriteMovie {
  id: string
  moviedbId: number
  title: string
  overview: string
  image: string
  releaseDate: string | null
  createdAt: string
  updatedAt: string
  status: 'active' | 'removed'
}

export function useFavourites() {
  const favourites = useState<FavouriteMovie[]>('favourites', () => [])
  const pending = useState<boolean>('favourites-pending', () => false)
  const error = useState<string | null>('favourites-error', () => null)

  async function fetchFavourites() {
    pending.value = true
    error.value = null
    try {
      const data = await $fetch<{ count: number, results: FavouriteMovie[] }>('/api/favourites')
      favourites.value = data.results ?? []
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Failed to load favourites.'
    } finally {
      pending.value = false
    }
  }

  function isFavourite(moviedbId: number): boolean {
    return favourites.value.some(movie => movie.moviedbId === moviedbId)
  }

  async function addFavourite(moviedbId: number) {
    const data = await $fetch<{ favourite: unknown, movie: FavouriteMovie }>('/api/favourites', {
      method: 'POST',
      body: { moviedbId }
    })
    if (!isFavourite(moviedbId)) {
      favourites.value = [...favourites.value, data.movie]
    }
  }

  async function removeFavourite(moviedbId: number) {
    await $fetch(`/api/favourites/${moviedbId}`, { method: 'DELETE' })
    favourites.value = favourites.value.filter(movie => movie.moviedbId !== moviedbId)
  }

  async function toggleFavourite(moviedbId: number) {
    if (isFavourite(moviedbId)) {
      await removeFavourite(moviedbId)
    } else {
      await addFavourite(moviedbId)
    }
  }

  return { favourites, pending, error, fetchFavourites, isFavourite, addFavourite, removeFavourite, toggleFavourite }
}
