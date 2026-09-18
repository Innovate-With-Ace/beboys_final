# Beboy's POS

Restaurant POS/admin system: dishes, inventory, orders, staff, and reports.
Built with Next.js, Supabase, and Clerk.

## Stack

- Next.js (App Router) + TypeScript
- Supabase (Postgres) via `@supabase/supabase-js`, admin client only (service role)
- Clerk for auth, with organization roles `org:admin` and `org:staff`
- Zustand for client-side cart/dish editor state
- TanStack Query for server-state caching
- Zod for input validation

## Environment variables

Create a `.env.local` with:

```
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

`SUPABASE_SERVICE_ROLE_KEY` is server-only — every DB call goes through
`supabaseAdmin` in `lib/supabase/server.ts`, so API routes are the only
thing enforcing access control (see Role model below). Never expose the
service role key to the client.

## Role model

Two Clerk organization roles:

- `org:admin` — full access: dishes, ingredients, categories, staff, reports.
- `org:staff` — POS checkout, dish/ingredient/category read access. Cannot
  create or edit ingredients (admin-only, see `app/api/ingredients/route.ts`
  and `[id]/route.ts`).

Enforcement happens at two layers:

1. `proxy.ts` — baseline check: any request under `/api` with no signed-in
   user is rejected with 401 before it reaches a route. Page routes
   (`/admin`, `/pos`) redirect to `/login` or `/no-access` based on role.
2. Each API route additionally calls `validateUser([...allowedRoles])`
   (`auth-guard.ts`) for role-level granularity. The middleware check is a
   safety net, not a replacement for this — every new route must still
   call `validateUser`.

## Database: RPCs

Two multi-step writes are implemented as Postgres functions
(`supabase/migrations/0001_atomic_order_and_dish_writes.sql`) instead of
sequential client-side calls, so they're transactional:

- `create_dish_with_ingredients(...)` — inserts a dish (a cooked batch)
  and its `dish_ingredients` rows, and deducts raw `ingredients.stock` by
  recipe quantity. This is where ingredient stock moves — **when the
  batch is cooked**, since this eatery doesn't track ingredient
  consumption per sale, only per batch.
- `create_pos_order(p_cashier_id, p_source, p_items)` — validates
  `dishes.servings_left`, inserts the order + order_items, and decrements
  `servings_left` (how many portions of the already-cooked batch remain).
  Does **not** touch ingredient stock — that was already deducted at
  creation.

Run the migration in the Supabase SQL editor (or via the Supabase CLI)
before deploying.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
