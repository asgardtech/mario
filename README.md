# mario

a mario like game

Bootstrapped by [LACC](https://github.com/asgardtech) — a Vite + React + TypeScript starter with shadcn/ui, Tailwind, TanStack Query, React Hook Form + Zod, React Router, and Supabase wired in.

## Stack

- **Vite 5** + **@vitejs/plugin-react-swc** for dev/build
- **React 18** + **TypeScript 5** (strict)
- **Tailwind CSS 3** + **shadcn/ui** (Radix primitives, `cva`, `tailwind-merge`)
- **TanStack Query** for server state
- **React Hook Form** + **Zod** for forms/validation
- **React Router 6** for routing
- **Supabase** as the platform backend
- **Vitest** + **Testing Library** for tests
- **Bun** as package manager and runner

## Getting started

```bash
bun install
cp .env.example .env   # fill in VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY
bun dev
```

Open http://localhost:8080.

## Scripts

| Command | Description |
|---|---|
| `bun dev` | Start the Vite dev server |
| `bun run build` | Production build |
| `bun run preview` | Preview the production build |
| `bun test` | Run unit tests once |
| `bun run test:watch` | Watch mode |
| `bun run lint` | ESLint |

## Adding shadcn components

```bash
bunx shadcn@latest add <component>
```

`components.json` is preconfigured with the `@/components/ui` alias.

## Project plan

The current plan lives in [`SPEC.md`](./SPEC.md). LACC creates a tracking issue
("Plan: mario") on the first commit so the lead agent
can pick up work immediately.

## License

MIT — see [LICENSE](./LICENSE).
