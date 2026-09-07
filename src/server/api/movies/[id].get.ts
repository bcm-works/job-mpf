// Movie details via The Movie Database (TMDB) API.
//
// GET /api/movies/343611?language=en-US

export default defineEventHandler(async (event) => {
  const rawId = getRouterParam(event, 'id')
  const movieId = Number(rawId)
  if (!rawId || !Number.isInteger(movieId) || movieId <= 0) {
    throw createError({ statusCode: 400, message: 'A numeric movie id is required, e.g. /api/movies/343611.' })
  }

  const query = getQuery(event)
  const language = typeof query.language === 'string' && query.language ? query.language : 'en-US'

  const movie = await getTmdbMovie(movieId, language)
  return toMovieDetails(movie)
})
