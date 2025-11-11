## ts-express-prisma-template

TypeScript + Express + Prisma template with a clean architecture:
controller → service → repository, a single Prisma client, typed errors, and a consistent API response envelope.

### Prerequisites
- Node.js LTS and npm
- Optional: Docker Desktop (for containerized dev)

### Getting started
1) Install dependencies:
   - `npm install`
2) Generate Prisma client and seed database:
   - `npx prisma generate`
   - `npx prisma db push` (or `npx prisma migrate dev` if you add migrations)
   - `npx prisma db seed`
3) Run:
   - Dev (watch): `npm run dev`
   - Prod: `npm run start`

Environment is loaded from `.env`. Port defaults to 3010 (`PORT=...` to override).

### Scripts
- `dev` starts Express with hot-reload via tsx/nodemon
- `start` runs the app
- `postinstall` runs `prisma generate`

### Prisma setup
- Prisma schema: `prisma/schema.prisma` (uses SQLite by default, `DATABASE_URL` in `.env`)
- Seed: `prisma/seed.ts` executed by `prisma db seed`
- Prisma config: `prisma.config.ts` (no longer using the deprecated package.json#prisma field)
- Single Prisma client: `src/db/prisma.ts` with a development-safe singleton

### Project structure
- `src/start.ts` – Express bootstrap (Helmet, request id, parsers, routes, error handling)
- `src/routes/` – Route registrations (e.g., `index.ts`)
- `src/controllers/` – Thin HTTP controllers (bind requests/responses)
- `src/services/` – Business logic (uses repositories, throws domain errors)
- `src/repositories/` – Data access (Prisma only here)
- `src/db/prisma.ts` – Prisma singleton
- `src/errors/` – Typed HTTP errors (e.g., `NotFoundError`)
- `src/dtos/` – API DTOs (`ClientDto`, `LinkDto`)
- `src/types/` – App-facing types (`Client`)
- `src/mappers/` – Mapping between entities and DTOs
- `src/utils/` – Utilities (response envelope, URL builder)
- `src/middleware/` – Middleware (`requestId`, `errorHandler`)

### API design
All responses use a common envelope:
```json
{
  "meta": {
    "status": 200,
    "path": "/clients",
    "method": "GET",
    "timestamp": "2025-01-01T12:00:00.000Z",
    "requestId": "uuid",
    "title": "All clients",
    "count": 2,
    "page": 1,
    "perPage": 25,
    "total": 100
  },
  "data": [...]
}
```
- Success helpers: `ok(req, data, extras?)`, `created(req, data, extras?)`, `noContent(req, extras?)`
- Error responses: `{ meta, data: null }`, with status and title derived from typed errors

### Hypermedia for collections
Following REST/HATEOAS principles, collection endpoints return hyperlinks to the resource items rather than the items themselves.
- `GET /clients` returns an array of `LinkDto`:
  - `href`: absolute URL to `/clients/:id`
  - `rel`: `"client"`
  - `title`: friendly label (name/email)
- `GET /clients/:id` returns the `ClientDto`

### Error handling
- Throw typed errors from services (e.g., `NotFoundError`)
- The `errorHandler` middleware translates them to HTTP responses using the standard envelope

### Request correlation
- `x-request-id` middleware ensures every request has a correlation id
- The id is included in all `meta` blocks and echoed back in the response headers

### Pagination (optional)
- `Meta` supports `page`, `perPage`, and `total`
- Add pagination to repositories/services using Prisma’s `skip/take` and `count`
- Populate the fields via the `extras` argument to `ok(...)`

### Development notes
- ES modules are used throughout (`"type": "module"`)
- Code is linted with ESLint + TypeScript
- No build output in dev; code runs via tsx (transpile in memory)

### Docker (optional)
1) `docker-compose up` (or `docker-compose up -d`)
2) Run commands with `docker-compose exec ts-app ...`
3) Stop with Ctrl+C or `docker-compose down`

### Extending
- Add new domains by repeating the pattern:
  - Prisma model → repository → service → controller → routes
  - Define DTOs and mappers for API shape
  - Use `ok/created/noContent` and typed errors for consistency