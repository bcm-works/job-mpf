// Add a movie to favourites (reactivates soft-removed entries).
//
// POST /api/favourites { moviedbId } -> 201 { favourite, movie }

import { kvPrefix } from '@/server/utils/kv'
import type { FavouriteRecord } from '@/server/types'
import { assertMoviedbId, buildFavourite, ensureMovieRecord, favouriteKey, useKv } from '@/server/utils/store'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ moviedbId?: unknown }>(event)
  const moviedbId = Number(body?.moviedbId)
  assertMoviedbId(moviedbId)

  // Verify the movie exists in TMDB and get a snapshot for the local cache.
  const details = await getTmdbMovie(moviedbId, 'en-US')

  const kv = await useKv()
  const movie = await ensureMovieRecord(kv, {
    id: details.id,
    title: details.title,
    overview: details.overview,
    posterUrl: details.poster_path ? `https://image.tmdb.org/t/p/original${details.poster_path}` : null,
    releaseDate: details.release_date || null
  })

  const key = [...kvPrefix, favouriteKey(moviedbId)]
  const existing = await kv.get<FavouriteRecord>(key)
  const favourite = buildFavourite(moviedbId, existing.value)
  await kv.set(key, favourite)

  event.node.res.statusCode = existing.value?.status === 'active' ? 200 : 201
  return { favourite, movie }
})
