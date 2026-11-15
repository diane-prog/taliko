# CLAUDE.md

This file provides guidance to Claude Code (or any AI coding agent) when working with code in this repository.

## Project

**Taliko** is a NestJS modular REST API powering an African edutainment and storytelling universe for children.
It follows the exact architectural principles and patterns of the **Kulina** reference project.

Key pillars:
- **Interactive African Stories & Folklore**: branching narratives with choices, animated scenes, audio narration in French, Fon, Yoruba, and English.
- **Educational Games & Quizzes**: phonics/alphabet (Baobab, Kora), local math counting (mangoes, pineapples), memory games, and wildlife discovery.
- **Creativity & Drawing**: interactive SVG coloring templates (masks, wildlife, villages) and digital canvas artwork storage.
- **African Music & Rhymes**: traditional nursery rhymes and discovering instruments (Kora, Balafon, Djembé, Talking Drum).
- **Parental Control & Dashboard**: strict daily screen-time quotas, heartbeat verification, child profile curation, 4-digit security PIN, and educational progression reports.
- **Child Privacy & Safety**: zero behavioral ad tracking, no public chatting between minors, COPPA-ready profile architecture.
- **African Monetization**: Freemium model, Family Premium and School Licenses supporting Mobile Money (MTN MoMo, Moov, Orange Money, Wave) and credit cards.

## Architecture

The application strictly follows the modular NestJS architecture:

### Directory Structure

- **`src/core/`** - Business domain modules
  - `auth/` - Parent/school authentication, JWT tokens, 4-digit parental PIN security
  - `users/` - Parent & Educator accounts
  - `roles/` - RBAC (super_admin, admin, teacher, parent)
  - `profiles/` - Multi-child profiles under parent accounts (avatar, age group, language)
  - `parental-control/` - Daily screen time enforcement, heartbeat pings, extra-time unlocking
  - `stories/` - Interactive African tales, choice nodes, multilingual audio tracks
  - `games/` - Educational mini-games, questions, stars & reward leveling
  - `creativity/` - Coloring templates and saved child artwork galleries
  - `audio-music/` - Rhymes, cultural songs, traditional African instruments
  - `dashboard/` - Parental reports and screen-time analytics
  - `subscriptions/` - Mobile Money and payment plans (FCFA)

- **`src/libs/`** - Infrastructure and shared libraries
  - `database/` - TypeORM PostgreSQL configuration with `AbstractEntity` and `AbstractRepository`

- **`src/helpers/`** - Cross-cutting helpers
  - `password_hash/` - bcrypt password and PIN hashing service
  - `api_documentation/` - Swagger and ReDoc documentation configuration
  - `cors.config.ts` - Environment-aware CORS configuration

- **`src/common/`** - Shared utilities and enforcement
  - `decorators/` - `@Public()`, `@RequireRoles()`, `@CurrentUser()`
  - `guards/` - `JwtAuthGuard`, `RolesGuard`
  - `interceptors/` - `ResponseInterceptor` (standard `{ statusCode, data }` envelope), `CircularInterceptor`
  - `logger/` - Winston centralized logger module
  - `response/` - `CustomValidationPipe`, `ErrorHandlingService`
  - `enum/` - `LanguageEnum` (fr, fon, yoruba, en), `AgeGroupEnum`, `UserRoleEnum`
  - `seeder/` - `RolesSeeder`, `ContentSeeder` (pre-seeds interactive story, quiz, instruments)

- **`src/config/`** - Typed configuration via `@nestjs/config`

## Strict Architectural Rules

1. **Repositories are FORBIDDEN in Controllers** — controllers only inject services.
2. **EntityManager stays in Repositories** — never inject EntityManager directly in services or controllers.
3. **All entities extend `AbstractEntity<T>`** (`id` UUID, `deleted`, `createdAt`, `updatedAt`, `deletedAt`).
4. **All repositories extend `AbstractRepository<T>`** (soft-delete awareness and standardized CRUD).
5. **English only in code** — identifiers, comments, JSDoc, error messages, and tests.
6. **One export per file** (except barrels).
7. **DTOs validate via `class-validator` and document with `@ApiProperty()`**.
8. **Successful REST responses are enveloped**:
   ```json
   { "statusCode": 200, "data": { ... } }
   ```

## Development Commands

- `pnpm run start:dev` - Start development server with hot-reload
- `pnpm run build` - Compile TypeScript to `dist/`
- `pnpm run start:prod` - Run production build (`node dist/main`)
- `pnpm run test` - Run unit tests
- `pnpm exec tsc --noEmit` - Verify TypeScript compilation with zero errors
