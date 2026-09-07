# API

This document summarises the available internal API endpoints provided by the code in [/src/server](../src/server/).

## Deno KV - Store a value

```bash
curl -X PUT http://localhost:3000/api/kv/my-key \
  -H 'Content-Type: application/json' \
  -d '{"value":{"hello":"world"}}'
```

Response: `{ "key": "my-key", "versionstamp": "..." }`

## Deno KV - Get a value

```bash
curl http://localhost:3000/api/kv/my-key
```

Response: `{ "key": "my-key", "value": {...}, "versionstamp": "..." }`. Returns `404` when the key has no stored value.

## Deno KV - Delete a value

```bash
curl -X DELETE http://localhost:3000/api/kv/my-key
```

Response: `{ "key": "my-key", "deleted": true }`

## Deno KV - List values

```bash
curl 'http://localhost:3000/api/kv?limit=100'
```

Response: `{ "count": 1, "entries": [{ "key": "my-key", "value": {...}, "versionstamp": "..." }] }`. `limit` defaults to `100` (max `500`).

## Movies - Setup

Movie endpoints proxy [The Movie Database](https://www.themoviedb.org/) via the shared client in `src/server/utils/movies.ts`, so API credentials never reach the browser. Set one of these (token preferred) in `.env` — see `.sample.env`:

- `APP_MOVIEDB_API_TOKEN` - sent as an `Authorization: Bearer` header.
- `APP_MOVIEDB_API_KEY` - sent as an `api_key` query param.

Without either, movie endpoints return `500`. Upstream `401`/`404` responses are passed through, other upstream failures return `502`.

## Movies - Search

```bash
curl 'http://localhost:3000/api/movies/search?query=jack+reacher'
```

Response: `{ "page": 1, "totalPages": 1, "totalResults": 3, "results": [{ "id": 75780, "title": "Jack Reacher", ... }] }`. `query` is required (`400` when missing). `page` defaults to `1` (max `1000`), `language` defaults to `en-US`.

## Movies - Popular

```bash
curl 'http://localhost:3000/api/movies/popular?page=1'
```

Response: same paged shape as search. `page` defaults to `1` (max `1000`), `language` defaults to `en-US`, optional `region` (e.g. `AU`).

## Movies - Details

```bash
curl http://localhost:3000/api/movies/343611
```

Response: `{ "id": 343611, "title": "Jack Reacher: Never Go Back", "overview": "...", "posterUrl": "https://image.tmdb.org/...", ... }`. Returns `400` for a non-numeric id and `404` when TMDB has no movie with that id. Optional `language` query param (defaults to `en-US`).

## Favourites - List

```bash
curl http://localhost:3000/api/favourites
```

Response: `{ "count": 1, "results": [{ "id": "movie:343611", "moviedbId": 343611, "title": "...", "status": "active", ... }] }`. Only `active` records are returned.

## Favourites - Add

```bash
curl -X POST http://localhost:3000/api/favourites \
  -H 'Content-Type: application/json' \
  -d '{"moviedbId":343611}'
```

Response: `201 { "favourite": {...}, "movie": {...} }` (`200` when already active). Returns `400` for a non-numeric id and `404` when TMDB has no movie with that id. Reactivates soft-removed entries.

## Favourites - Remove (soft)

```bash
curl -X DELETE http://localhost:3000/api/favourites/343611
```

Response: `{ "id": "343611", "removed": true }`. Sets `status` to `"removed"` instead of deleting. Returns `404` when never added.

## Groups - List

```bash
curl http://localhost:3000/api/groups
```

Response: `{ "count": 1, "results": [{ "id": "...", "title": "...", "movieIds": ["movie:343611"], "status": "active", ... }] }`. Only `active` groups, newest first.

## Groups - Create

```bash
curl -X POST http://localhost:3000/api/groups \
  -H 'Content-Type: application/json' \
  -d '{"title":"Friday night"}'
```

Response: `201 GroupRecord`. `title` must be 1-80 characters.

## Groups - Details

```bash
curl http://localhost:3000/api/groups/my-group-id
```

Response: `{ "group": {...}, "movies": [{...MovieRecord}] }`. `movies` resolves `movieIds` to `active` movie snapshots. Returns `404` for missing or soft-removed groups.

## Groups - Rename

```bash
curl -X PATCH http://localhost:3000/api/groups/my-group-id \
  -H 'Content-Type: application/json' \
  -d '{"title":"New name"}'
```

Response: updated `GroupRecord`. Returns `404` for missing or soft-removed groups.

## Groups - Remove (soft)

```bash
curl -X DELETE http://localhost:3000/api/groups/my-group-id
```

Response: `{ "id": "...", "removed": true }`. Sets `status` to `"removed"` instead of deleting.

## Groups - Add movie

```bash
curl -X POST http://localhost:3000/api/groups/my-group-id/movies \
  -H 'Content-Type: application/json' \
  -d '{"moviedbId":343611}'
```

Response: `{ "group": {...}, "movie": {...} }`. Idempotent — re-adding keeps a single entry. Caches the movie from TMDB when needed.

## Groups - Remove movie

```bash
curl -X DELETE http://localhost:3000/api/groups/my-group-id/movies/343611
```

Response: `{ "group": {...}, "removed": 343611 }`. Idempotent — the group stays `active`.
