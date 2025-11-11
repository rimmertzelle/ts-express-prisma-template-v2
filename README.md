## ts-express-prisma-template

TypeScript + Express + Prisma template with a clean architecture:
controller → service → repository, a single Prisma client, typed errors, and a consistent API response envelope.

### Prerequisites
- Node.js LTS and npm
- Optional: Docker Desktop (for containerized dev)

### Getting started
1) Install dependencies:
   - `npm install`
a2) Set up MongoDB using Docker:
   - Start MongoDB: `docker-compose up -d mongo`
   - Initialize replica set (required for Prisma transactions):
     ```bash
     docker exec $(docker-compose ps -q mongo) mongosh --quiet --eval "try { rs.status() } catch(e) { rs.initiate({_id:'rs0',members:[{_id:0,host:'localhost:27017'}]}) }"
     ```
   - Or use MongoDB Atlas (cloud) - no replica set setup needed
3) Set up environment:
   - Create a `.env` file with `DATABASE_URL="mongodb://localhost:27017/ts-express-prisma-template"`
   - For MongoDB Atlas: `DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/dbname"`
4) Generate Prisma client and seed database:
   - `npx prisma generate`
   - `npx prisma db push` (MongoDB doesn't use migrations, so use `db push` instead)
   - `npx prisma db seed`
5) Run:
   - Dev (watch): `npm run dev`
   - Prod: `npm run start`

Environment is loaded from `.env`. Port defaults to 3010 (`PORT=...` to override).

### Scripts
- `dev` starts Express with hot-reload via tsx/nodemon
- `start` runs the app
- `postinstall` runs `prisma generate`

### Prisma setup
- Prisma schema: `prisma/schema.prisma` (uses MongoDB, `DATABASE_URL` in `.env`)
  - Format: `mongodb://localhost:27017/dbname` or MongoDB Atlas connection string
  - **Important**: MongoDB must be configured as a replica set for Prisma transactions (upsert, createMany, etc.)
  - IDs are MongoDB ObjectIds (24-character hex strings), not integers
- Seed: `prisma/seed.ts` executed by `prisma db seed`
- Prisma config: `prisma.config.ts` (loads environment variables from `.env`)
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

### Request Flow

The following sequence diagram illustrates how a `GET /clients` request travels through the application:

```mermaid
sequenceDiagram
    participant Client
    participant Express as Express App
    participant Helmet as Helmet Middleware
    participant RequestId as RequestId Middleware
    participant Router as Routes
    participant Controller as ClientsController
    participant Service as ClientsService
    participant Repository as ClientsRepository
    participant Prisma as Prisma Client
    participant MongoDB
    participant Mapper as ClientMapper
    participant ErrorHandler as ErrorHandler

    Client->>Express: GET /clients
    Express->>Helmet: Apply security headers
    Helmet-->>Express: Continue
    Express->>RequestId: Generate/read x-request-id
    RequestId-->>Express: Set request ID
    Express->>Router: Match route /clients
    Router->>Controller: getClients(req, res)
    
    Controller->>Service: listClients()
    Service->>Repository: findAll()
    Repository->>Prisma: client.findMany()
    Prisma->>MongoDB: Query Client collection
    MongoDB-->>Prisma: Return Client entities
    Prisma-->>Repository: Client[]
    Repository-->>Service: Client[]
    
    Service->>Mapper: toClientDtos(clients)
    Mapper-->>Service: ClientDto[]
    Service-->>Controller: ClientDto[]
    
    Controller->>Controller: Map to LinkDto[]
    Controller->>Controller: Build response envelope
    Controller->>Client: 200 OK { meta, data: LinkDto[] }
    
    alt Error occurs
        Service->>ErrorHandler: throw NotFoundError/BadRequestError
        ErrorHandler->>Client: Error response { meta, data: null }
    end
```

**Key Points:**
- **Middleware Chain**: Security (Helmet) → Request ID → Body Parsing → Routes
- **Layered Architecture**: Controller → Service → Repository → Prisma → MongoDB
- **Data Transformation**: Entities (Client) → DTOs (ClientDto) → Hypermedia (LinkDto)
- **Error Handling**: Errors bubble up through layers and are caught by the error handler middleware

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
  - **Note**: `:id` must be a valid MongoDB ObjectId (24-character hex string)
  - Invalid IDs return `400 Bad Request` with a descriptive error message

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
- MongoDB ObjectId validation is handled in the service layer (`src/services/clientsService.ts`)
- Use mongo-express (http://localhost:8081) or MongoDB Compass to view database contents

### Docker Commands

#### Start Services
- **Start all services**: `docker-compose up -d`
- **Start MongoDB only**: `docker-compose up -d mongo`
- **Start mongo-express only**: `docker-compose up -d mongo-express` (requires MongoDB to be running)

#### Stop Services
- **Stop all services**: `docker-compose down`
- **Stop specific service**: `docker-compose stop mongo` or `docker-compose stop mongo-express`
- **Stop and remove containers**: `docker-compose down -v` (removes volumes too)

#### View Logs
- **All services**: `docker-compose logs -f`
- **MongoDB logs**: `docker-compose logs -f mongo`
- **mongo-express logs**: `docker-compose logs -f mongo-express`

#### MongoDB Management
- **Initialize replica set** (required for Prisma):
  ```bash
  docker exec $(docker-compose ps -q mongo) mongosh --quiet --eval "try { rs.status() } catch(e) { rs.initiate({_id:'rs0',members:[{_id:0,host:'localhost:27017'}]}) }"
  ```
- **Access MongoDB shell**:
  ```bash
  docker exec -it $(docker-compose ps -q mongo) mongosh ts-express-prisma-template
  ```
- **Check replica set status**:
  ```bash
  docker exec $(docker-compose ps -q mongo) mongosh --eval "rs.status()"
  ```

#### mongo-express (Web UI)
- **Access**: http://localhost:8081
- **Login**: username `admin`, password `pass`
- **Features**: Browse databases, view collections, edit documents
- **Note**: mongo-express connects to MongoDB running in Docker, not external MongoDB instances

#### Container Management
- **View running containers**: `docker-compose ps`
- **View all containers**: `docker-compose ps -a`
- **Restart a service**: `docker-compose restart mongo`
- **Rebuild containers**: `docker-compose up -d --build`

### Extending
- Add new domains by repeating the pattern:
  - Prisma model → repository → service → controller → routes
  - Define DTOs and mappers for API shape
  - Use `ok/created/noContent` and typed errors for consistency