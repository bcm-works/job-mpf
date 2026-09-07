// Shared The Movie Database (TMDB) client for server routes.
//
// Auth (server-side only, never exposed to the client):
//   - Preferred: APP_MOVIEDB_API_TOKEN as Bearer token
//   - Fallback: APP_MOVIEDB_API_KEY as `api_key` query param

const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original'

export type TmdbCredentials = {
  token?: string
  apiKey?: string
}

export type TmdbParams = Record<string, string | number | boolean | undefined>

export interface TmdbMovieListItem {
  id: number
  title: string
  original_title: string
  original_language: string
  overview: string
  release_date: string
  poster_path: string | null
  backdrop_path: string | null
  popularity: number
  vote_average: number
  vote_count: number
  genre_ids: number[]
  adult: boolean
}

export interface TmdbPagedMovies {
  page: number
  total_pages: number
  total_results: number
  results: TmdbMovieListItem[]
}

export interface TmdbMovieDetails {
  id: number
  title: string
  original_title: string
  original_language: string
  overview: string
  tagline: string | null
  status: string | null
  release_date: string
  runtime: number | null
  homepage: string | null
  imdb_id: string | null
  genres: Array<{ id: number, name: string }>
  production_companies: unknown[]
  production_countries: unknown[]
  spoken_languages: unknown[]
  poster_path: string | null
  backdrop_path: string | null
  popularity: number
  vote_average: number
  vote_count: number
  adult: boolean
  video: boolean
}

interface TmdbFetchError {
  response?: {
    status?: number
    data?: { status_message?: string }
  }
  data?: { status_message?: string }
}

export function getTmdbCredentials(): TmdbCredentials {
  const token = process.env.APP_MOVIEDB_API_TOKEN?.trim()
  if (token) {
    return { token }
  }
  const apiKey = process.env.APP_MOVIEDB_API_KEY?.trim()
  if (apiKey) {
    return { apiKey }
  }
  throw createError({
    statusCode: 500,
    message: 'MovieDB credentials are not configured. Set APP_MOVIEDB_API_TOKEN or APP_MOVIEDB_API_KEY.'
  })
}

export function toImageUrl(path: unknown): string | null {
  return typeof path === 'string' && path ? `${TMDB_IMAGE_BASE_URL}${path}` : null
}

export function toMovieSummary(movie: TmdbMovieListItem) {
  return {
    id: movie.id,
    title: movie.title,
    originalTitle: movie.original_title,
    originalLanguage: movie.original_language,
    overview: movie.overview,
    releaseDate: movie.release_date || null,
    posterPath: movie.poster_path,
    backdropPath: movie.backdrop_path,
    posterUrl: toImageUrl(movie.poster_path),
    backdropUrl: toImageUrl(movie.backdrop_path),
    popularity: movie.popularity,
    voteAverage: movie.vote_average,
    voteCount: movie.vote_count,
    genreIds: movie.genre_ids ?? [],
    adult: movie.adult ?? false
  }
}

export function toMovieDetails(movie: TmdbMovieDetails) {
  return {
    id: movie.id,
    title: movie.title,
    originalTitle: movie.original_title,
    originalLanguage: movie.original_language,
    overview: movie.overview,
    tagline: movie.tagline ?? null,
    status: movie.status ?? null,
    releaseDate: movie.release_date || null,
    runtime: movie.runtime ?? null,
    homepage: movie.homepage || null,
    imdbId: movie.imdb_id ?? null,
    genres: movie.genres ?? [],
    productionCompanies: movie.production_companies ?? [],
    productionCountries: movie.production_countries ?? [],
    spokenLanguages: movie.spoken_languages ?? [],
    posterPath: movie.poster_path,
    backdropPath: movie.backdrop_path,
    posterUrl: toImageUrl(movie.poster_path),
    backdropUrl: toImageUrl(movie.backdrop_path),
    popularity: movie.popularity,
    voteAverage: movie.vote_average,
    voteCount: movie.vote_count,
    adult: movie.adult ?? false,
    video: movie.video ?? false
  }
}

async function tmdbGet<T>(path: string, params: TmdbParams): Promise<T> {
  const credentials = getTmdbCredentials()
  const query: TmdbParams = { ...params }
  if (credentials.apiKey) {
    query.api_key = credentials.apiKey
  }
  try {
    return (await $fetch(`${TMDB_BASE_URL}${path}`, {
      query,
      headers: {
        Accept: 'application/json',
        ...(credentials.token ? { Authorization: `Bearer ${credentials.token}` } : {})
      }
    })) as T
  } catch (error: unknown) {
    const fetchError = error as TmdbFetchError
    const statusCode = fetchError?.response?.status ?? 502
    const message = fetchError?.response?.data?.status_message ?? fetchError?.data?.status_message ?? 'Failed to fetch data from The Movie Database.'
    throw createError({ statusCode: statusCode === 401 || statusCode === 404 ? statusCode : 502, message })
  }
}

export function searchTmdbMovies(args: { query: string, page: number, language: string, includeAdult: boolean }): Promise<TmdbPagedMovies> {
  return tmdbGet<TmdbPagedMovies>('/search/movie', {
    query: args.query,
    page: args.page,
    language: args.language,
    include_adult: args.includeAdult
  })
}

export function getPopularTmdbMovies(args: { page: number, language: string, region?: string }): Promise<TmdbPagedMovies> {
  return tmdbGet<TmdbPagedMovies>('/movie/popular', {
    page: args.page,
    language: args.language,
    region: args.region
  })
}

export function getTmdbMovie(id: number, language: string): Promise<TmdbMovieDetails> {
  return tmdbGet<TmdbMovieDetails>(`/movie/${id}`, { language })
}
