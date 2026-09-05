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
