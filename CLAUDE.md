# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start Fastify in watch mode with `tsx`, loading `.env` (port 3333, docs at `/docs`).
- `npm run build` — `tsc` then `tsc-alias` (rewrites `@/*` path aliases for the emitted `dist/`).
- `npm start` — run compiled `dist/server.js`.
- `npm run lint` — Biome check + write on `src/`. Also runs via Husky/lint-staged pre-commit.
- `npm test` — Vitest (single run). Single test: `npx vitest run src/modules/users/tests/user.service.spec.ts`. Watch: `npx vitest`.

## Architecture

Fastify + TypeScript REST API using a strict **Controller → Service → Repository** layering with **Awilix DI**, **Zod** schemas via `fastify-type-provider-zod`, **PostgreSQL** (`pg`) for domain data, and **MongoDB** for audit logs. PDFs go to Cloudflare R2 (S3 SDK); images to Cloudinary.

### Module layout convention

Each feature lives in `src/modules/<feature>/` with four files:
`<feature>.routes.ts`, `<feature>.controller.ts`, `<feature>.service.ts`, `<feature>.repository.ts`,
plus optional `tests/*.spec.ts`.

Interfaces, Zod schemas, route-typing helpers, and domain error classes live separately under `src/models/<feature>/` (e.g. `*.service.interface.ts`, `*.repository.interface.ts`, `*.schema.ts`, `*.routes.ts` for request/schema types, `*.errors.ts`). Controllers/services depend on the **interfaces** in `src/models/`, not on concrete classes.

### Dependency injection (Awilix)

- `src/lib/container.ts` builds a typed container; the `Cradle` shape lives in `src/models/cradle.ts`.
- Classes are registered with `asClass(...).classic()`, so constructors receive positional args **in the order properties are declared on `Cradle`**. If you reorder `Cradle`, you break wiring — keep service constructor parameter order aligned with the cradle field order.
- The container is attached to the Fastify instance via `app.decorate('container', ...)`. Routes resolve controllers with `app.container.resolve('xxxController')`.
- Re-export barrels: `src/lib/{controllers,services,repositories}.ts` aggregate exports — when adding a module, append to all three barrels, to `Cradle`, and to `buildContainer`.

### Request flow

1. `src/router.ts` registers each module's routes (some with a prefix).
2. Routes attach `preHandler: app.authenticate` (JWT verify) or `app.requireAdmin` (JWT + `role === 'admin'`) — both are decorators set in `server.ts`.
3. Zod schemas in `schema: {...}` drive both validation and the OpenAPI/Scalar docs (`jsonSchemaTransform`).
4. Controllers are thin: parse `req`, call service, send reply. No business logic.
5. Services throw subclasses of `AppError` (see `src/models/errors.ts`: `NotFoundError`, `BadRequestError`, `ConflictError`, `ForbiddenError`, `UnauthorizedError`, `ServiceUnavailableError`). The global handler in `server.ts` maps `AppError → reply.code(statusCode)`, Zod validation errors → 400, and reports 5xx to Sentry.

### Audit logging

`src/lib/audit-hook.ts` registers a global `onResponse` hook. For admin users making `POST/PATCH/PUT/DELETE` requests with `statusCode < 400`, it derives the `entity` from the first non-param URL segment (must be in `AUDIT_ENTITIES`) and the `entityId` from `params.id`/`moduleId`/`lessonId`/`questionId`, then writes to the Mongo audit collection. When adding a new admin-mutating resource, ensure the route's top-level segment is registered in `AUDIT_ENTITIES`, otherwise it will be silently skipped.

### Path aliases & ESM

`tsconfig.json` maps `@/*` → `src/*`. Project is `"type": "module"` — **imports must include the `.js` extension** (Node16 ESM resolution), even for `.ts` source files. `tsc-alias` rewrites the aliases at build time.

### Testing

Vitest, colocated under `src/modules/<feature>/tests/`. Existing specs are unit tests against services with hand-rolled in-memory fakes for repositories — follow that pattern rather than mocking the DI container.

## Adding a new module (checklist)

1. Create `src/modules/<feature>/{<feature>.routes,controller,service,repository}.ts`.
2. Create `src/models/<feature>/{<feature>.service.interface,repository.interface,schema,routes,errors}.ts`.
3. Export the class from `src/lib/{repositories,services,controllers}.ts`.
4. Add fields to `Cradle` in `src/models/cradle.ts` (order matters for `.classic()` injection).
5. Register the three classes in `src/lib/container.ts` matching the cradle order.
6. Register the routes in `src/router.ts`.
7. If admin mutations should be audited, add the URL root segment to `AUDIT_ENTITIES`.
