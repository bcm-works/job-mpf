// Movie search via The Movie Database (TMDB) API.
//
// GET /api/movies/search?query=jack+reacher&page=1&language=en-US

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const search = typeof query.query === 'string' ? query.query.trim() : ''
  if (!search) {
    throw createError({ statusCode: 400, message: 'Query parameter "query" is required.' })
  }

  const page = Math.min(Math.max(Number(query.page ?? 1) || 1, 1), 1000)
  const language = typeof query.language === 'string' && query.language ? query.language : 'en-US'
  const includeAdult = query.include_adult === 'true'

  const data = await searchTmdbMovies({ query: search, page, language, includeAdult })

  return {
    page: data.page,
    totalPages: data.total_pages,
    totalResults: data.total_results,
    results: (data.results ?? []).map(toMovieSummary)
  }
})
