// Popular movies via The Movie Database (TMDB) API.
//
// GET /api/movies/popular?page=1&language=en-US&region=AU

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const page = Math.min(Math.max(Number(query.page ?? 1) || 1, 1), 1000)
  const language = typeof query.language === 'string' && query.language ? query.language : 'en-US'
  const region = typeof query.region === 'string' && query.region ? query.region : undefined

  const data = await getPopularTmdbMovies({ page, language, region })

  return {
    page: data.page,
    totalPages: data.total_pages,
    totalResults: data.total_results,
    results: (data.results ?? []).map(toMovieSummary)
  }
})
