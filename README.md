# NestJS Auth + Users Template

NestJS starter with JWT registration/login, PostgreSQL/TypeORM and Swagger. Only `auth` and `users` are business modules.

## Run

Copy `.env.example` to `.env`, then run `docker compose -f docker-compose.local.yml up --build`.
API: `http://localhost:3000/api/v1`; Swagger: `http://localhost:3000/docs`.

For local Node development, run `npm install`, start PostgreSQL with `docker compose -f docker-compose.local.yml up postgres`, set `DATABASE_HOST=localhost` in `.env` and run `npm run start:dev`.
The sample file lists the validated API, timeout, CORS, database and JWT settings. `JWT_SECRET` requires at least 12 characters; replace all sample secrets outside development.

## Boundaries and verification

- Features live under `src/modules/<feature>/{domain,application,infrastructure}`.
- `POST /api/v1/auth/register` creates non-admin accounts; `POST /api/v1/auth/login` returns auth data. `GET /api/v1` is the health route.
- Public user DTOs must not expose passwords. Keep credentials confined to authentication and persistence inputs.
- Run `npm test`, `npm run typecheck` and `npm run build` before a PR. `npm run lint` modifies files with ESLint fixes.
- Production Docker configuration is in `docker-compose.prod.yml`. Add migrations for domain changes before disabling development schema synchronization; the migration datasource shares runtime database variables.

[MIT license](LICENSE).
