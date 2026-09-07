// Shared KV-backed store for movies, favourites and lists.
//
// Single-user scope: every record belongs to DEFAULT_USER_ID ("default").
// All records support soft remove via `status: "active" | "removed"` —
// DELETE handlers set `status` to "removed" instead of deleting the KV entry,
// and list/read handlers only return "active" records. Re-adding a removed
// item reactivates the existing record.

import type { FavouriteRecord, ListRecord, MovieRecord } from '@/server/types'
import { kvPrefix, useKv } from '@/server/utils/kv'
import type { KvInstance } from '@/server/utils/kv'

export const DEFAULT_USER_ID = 'default'

export const movieKey = (moviedbId: number): string => `movie:${moviedbId}`
export const favouriteKey = (moviedbId: number): string => `favourite:${moviedbId}`
export const listKey = (id: string): string => `list:${id}`

export function assertMoviedbId(value: unknown): asserts value is number {
  if (typeof value !== 'number' || !Number.isInteger(value) || value <= 0) {
    throw createError({ statusCode: 400, message: 'A numeric moviedbId is required.' })
  }
}

export function now(): Date {
  return new Date()
}

/** List active records whose KV key (last segment) starts with `prefix:`. */
export async function listActive<T extends { status: string }>(kv: KvInstance, prefix: string): Promise<T[]> {
  const results: T[] = []
  for await (const entry of kv.list<T>({ prefix: kvPrefix }, { limit: 500 })) {
    const last = String(entry.key[entry.key.length - 1])
    if (!last.startsWith(`${prefix}:`)) {
      continue
    }
    if (entry.value && (entry.value as T).status === 'active') {
      results.push(entry.value as T)
    }
  }
  return results
}

export type MovieSnapshot = {
  id: number
  title: string
  overview: string
  posterUrl: string | null
  releaseDate: string | null
}

/** Fetch or create the cached MovieRecord for a TMDB movie, reactivating soft-removed entries. */
export async function ensureMovieRecord(kv: KvInstance, snapshot: MovieSnapshot): Promise<MovieRecord> {
  const key = [...kvPrefix, movieKey(snapshot.id)]
  const existing = await kv.get<MovieRecord>(key)
  if (existing.value) {
    const reactivated: MovieRecord = {
      ...existing.value,
      moviedbId: snapshot.id,
      title: snapshot.title,
      overview: snapshot.overview,
      image: snapshot.posterUrl ?? existing.value.image ?? '',
      releaseDate: (snapshot.releaseDate ? new Date(snapshot.releaseDate) : existing.value.releaseDate) as Date,
      updatedAt: now(),
      status: 'active'
    }
    await kv.set(key, reactivated)
    return reactivated
  }
  const record: MovieRecord = {
    id: movieKey(snapshot.id),
    moviedbId: snapshot.id,
    title: snapshot.title,
    overview: snapshot.overview,
    image: snapshot.posterUrl ?? '',
    releaseDate: (snapshot.releaseDate ? new Date(snapshot.releaseDate) : new Date(0)) as Date,
    createdAt: now(),
    updatedAt: now(),
    status: 'active'
  }
  await kv.set(key, record)
  return record
}

/** Fetch an active MovieRecord by moviedbId, or null when missing/removed. */
export async function getActiveMovie(kv: KvInstance, moviedbId: number): Promise<MovieRecord | null> {
  const entry = await kv.get<MovieRecord>([...kvPrefix, movieKey(moviedbId)])
  if (!entry.value || entry.value.status !== 'active') {
    return null
  }
  return entry.value
}

/** Resolve a list's movieIds to active MovieRecords, skipping missing/removed entries. */
export async function resolveListMovies(kv: KvInstance, list: ListRecord): Promise<MovieRecord[]> {
  const movies: MovieRecord[] = []
  for (const movieId of list.movieIds ?? []) {
    const entry = await kv.get<MovieRecord>([...kvPrefix, movieId])
    if (entry.value && entry.value.status === 'active') {
      movies.push(entry.value)
    }
  }
  return movies
}

/** Build a FavouriteRecord, reactivating timestamps when re-adding. */
export function buildFavourite(moviedbId: number, existing: FavouriteRecord | null): FavouriteRecord {
  const timestamp = now()
  if (existing) {
    return { ...existing, updatedAt: timestamp, status: 'active' }
  }
  return {
    id: String(moviedbId),
    userId: DEFAULT_USER_ID,
    movieId: movieKey(moviedbId),
    createdAt: timestamp,
    updatedAt: timestamp,
    status: 'active'
  }
}

/** Soft-remove a record by setting status to "removed". Returns null when no record exists. */
export async function softRemove<T extends { updatedAt: Date, status: string }>(kv: KvInstance, key: string): Promise<T | null> {
  const fullKey = [...kvPrefix, key]
  const entry = await kv.get<T>(fullKey)
  if (!entry.value) {
    return null
  }
  if ((entry.value as T).status === 'removed') {
    return entry.value as T
  }
  const removed = { ...entry.value, status: 'removed', updatedAt: now() } as T
  await kv.set(fullKey, removed)
  return removed
}

export { useKv }
