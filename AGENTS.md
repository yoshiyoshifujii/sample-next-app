# Repository Guidelines

## Project Structure & Module Organization

- `src/app/` holds the Next.js App Router entry points such as `src/app/page.tsx` and `src/app/layout.tsx`.
- `src/app/globals.css` defines Tailwind CSS setup and global styles.
- `src/components/` stores UI, feature, and layout components.
- `src/lib/` contains utility functions and helpers.
- `src/hooks/` contains custom React hooks.
- `src/services/` contains API calls and external service clients.
- `src/types/` contains shared TypeScript type definitions.
- `src/constants/` contains application constants.
- `src/config/` contains configuration modules.
- `public/` contains static assets served at the site root (for example, `/next.svg`).
- Configuration lives at the repo root: `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, and `postcss.config.mjs`.

## Build, Test, and Development Commands

- `npm run dev` starts the local dev server at `http://localhost:3000`.
- `npm run build` creates the production build in `.next/`.
- `npm run start` serves the production build (run after `npm run build`).
- `npm run lint` runs ESLint using `eslint.config.mjs`.

## Coding Style & Naming Conventions

- TypeScript + React with 2-space indentation.
- Use double quotes for strings, matching existing files like `app/page.tsx`.
- Components use `PascalCase` (e.g., `UserCard`); variables and functions use `camelCase`.
- Route and folder names in `app/` should stay lowercase, matching Next.js conventions.
- Styling is primarily Tailwind utility classes; keep class lists readable and grouped by layout, spacing, then typography.

## Clean Code Guidelines

- Keep components small and focused; extract reusable UI into `src/components/ui`.
- Prefer feature-specific composition in `src/components/features` with clear ownership boundaries.
- Push domain logic into `src/lib` or `src/services` instead of pages/components when possible.
- Use meaningful names; avoid abbreviations except common ones (e.g., `id`, `url`).
- Co-locate types near usage or centralize shared ones in `src/types` to avoid duplication.

## Testing Guidelines

- No test framework is configured yet. If tests are added, document the runner and add scripts in `package.json`.
- Prefer colocating tests near the module (for example, `app/__tests__/page.test.tsx`) and keep names descriptive.

## Commit & Pull Request Guidelines

- The Git history currently shows only the initial scaffold commit, so no strict convention is enforced.
- Use short, imperative commit messages (for example, "Add hero section layout").
- PRs should include a brief summary, testing notes (commands run), and screenshots or recordings for UI changes.

## Configuration & Assets

- Tailwind is wired through `app/globals.css` and `postcss.config.mjs`.
- If environment variables are needed later, document them in a new `.env.example` file.
