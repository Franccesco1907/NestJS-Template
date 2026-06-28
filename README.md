# NestJS Auth + Users Template

A focused NestJS starter for building REST APIs with authentication, user accounts, PostgreSQL persistence, Swagger documentation, Docker-based local development, and a layered module structure.

This template intentionally includes only two business modules:

| Module | Responsibility |
| --- | --- |
| `auth` | Public registration, login, JWT issuance, and JWT strategy wiring. |
| `users` | User entity, repository boundary, user creation use case, and sanitized user DTOs. |

## Quick Start

### Option 1: Docker local stack

1. Copy the sample environment file:

   ```bash
   cp .env.example .env
   ```

2. Start PostgreSQL and the NestJS API:

   ```bash
   docker compose -f docker-compose.local.yml up --build
   ```

3. Open the API docs:

   - API base URL: <http://localhost:3000/api/v1>
   - Swagger UI: <http://localhost:3000/docs>

### Option 2: Local Node.js

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy and adjust the environment file:

   ```bash
   cp .env.example .env
   ```

3. Start PostgreSQL using Docker:

   ```bash
   docker compose -f docker-compose.local.yml up postgres
   ```

4. In another terminal, run the API:

   ```bash
   npm run start:dev
   ```

## Environment Variables

The application reads `.env` through `@nestjs/config` and validates the variables at startup.

| Variable | Required | Example | Description |
| --- | --- | --- | --- |
| `NODE_ENV` | Yes | `development` | Runtime mode: `development`, `production`, or `test`. |
| `API_PORT` | Yes | `3000` | Port used by the NestJS HTTP server. |
| `TIMEOUT` | Yes | `12000` | Global request timeout in milliseconds. |
| `CORS_ORIGINS` | Yes | `http://localhost,http://localhost:4200` | Comma-separated allowed origins. |
| `CORS_METHODS` | Yes | `GET,POST,PUT,DELETE,OPTIONS` | Allowed CORS methods. |
| `CORS_ALLOWED_HEADERS` | Yes | `Content-Type,Authorization` | Allowed CORS request headers. |
| `CORS_EXPOSED_HEADERS` | Yes | `Content-Type,Authorization` | Exposed CORS response headers. |
| `CORS_CREDENTIALS` | Yes | `true` | Whether CORS credentials are enabled. |
| `DATABASE_HOST` | Yes | `postgres` | PostgreSQL host. Use `localhost` when running the API outside Docker. |
| `DATABASE_PORT` | Yes | `5432` | PostgreSQL port. |
| `DATABASE_USERNAME` | Yes | `postgres` | PostgreSQL username. |
| `DATABASE_PASSWORD` | Yes | `postgres` | PostgreSQL password. |
| `DATABASE_NAME` | Yes | `nestjs_template` | PostgreSQL database name. |
| `JWT_SECRET` | Yes | `change-me-in-a-real-environment` | JWT signing secret. Must be at least 12 characters. |

## Available Commands

| Command | Purpose |
| --- | --- |
| `npm run start` | Start the NestJS app once. |
| `npm run start:dev` | Start the app in watch mode. |
| `npm run start:debug` | Start the app in debug watch mode. |
| `npm run start:prod` | Run the compiled app from `dist/main`. |
| `npm run build` | Compile the application with Nest CLI. |
| `npm run build:prod` | Compile the production build. |
| `npm run typecheck` | Run TypeScript type checking without emitting files. |
| `npm run lint` | Run ESLint with `--fix` for local cleanup. |
| `npm run format` | Format TypeScript source and test files with Prettier. |
| `npm test` | Run the Jest test suite. |
| `npm run test:watch` | Run Jest in watch mode. |
| `npm run test:cov` | Run Jest with coverage output. |
| `npm run test:debug` | Run Jest through the Node debugger. |

## API Surface

All routes are served under the global prefix `/api/v1`.

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/v1` | Health check endpoint. |
| `POST` | `/api/v1/auth/register` | Create a non-admin user account. The public DTO accepts email, password, first name, and last name. |
| `POST` | `/api/v1/auth/login` | Authenticate with email and password and receive auth data. |

Swagger is available at `/docs` and includes bearer-auth support for protected endpoints.

## Architecture and Module Boundaries

The template keeps a small, explicit module graph:

```text
AppModule
├── CustomConfigModule
├── DatabaseModule
│   └── OrmDatabaseModule
├── AuthModule
└── UsersModule
```

The feature code follows a layered structure:

```text
src/modules/<module>
├── domain          # entities and repository contracts
├── application     # use cases
└── infrastructure  # controllers, DTOs, mappers, repositories, guards, strategies
```

Auth and user responses are intentionally sanitized: password values are accepted only as credentials or persistence inputs and are not returned by the public user DTO mapper.

## Database

- PostgreSQL is the runtime database and is configured through TypeORM.
- The migration datasource uses the same PostgreSQL environment variables as the application runtime.
- In local Docker mode, the service-to-service database host is `postgres`. In local Node mode, set `DATABASE_HOST=localhost` in `.env`.

## Testing

Run the full verification set before opening a pull request:

```bash
npm test
npm run typecheck
npm run build
```

The current tests cover shared interceptors/filters/utilities, environment and TypeORM configuration, auth/user use cases, and user DTO mapping.

## Production Docker

Build and run the production compose stack with:

```bash
docker compose -f docker-compose.prod.yml up --build
```

Use production-grade secrets in `.env` before running the production stack. The sample `.env.example` is only a development baseline.

## Next Steps for Consumers

- Replace the default package metadata with your service name and repository URLs.
- Add CI workflow files that run `npm test`, `npm run typecheck`, and `npm run build`.
- Add migrations for your first domain-specific entities before disabling TypeORM synchronization in development.
- Add new business modules under `src/modules/<feature>` while keeping domain, application, and infrastructure boundaries explicit.
