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
