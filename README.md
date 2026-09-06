# Portal Foundation Dashboard

React, TypeScript, Vite, and Tailwind CSS prototype for a portal foundation dashboard. It demonstrates a composite account overview, concurrent global search across independent mock APIs, and a reactive notification center.

## Run Locally

```bash
npm install
npm start
```

The Vite development server will print the local URL, usually `http://localhost:5173/`.

## Build

```bash
npm run build
```

## Deploy To GitHub Pages

Pushing to `main` runs `.github/workflows/deploy-pages.yml`, which builds the Vite application and publishes `dist` to GitHub Pages. In the repository's **Settings > Pages**, select **GitHub Actions** as the publishing source.

The deployed project site is available at `https://nakuzm.github.io/my-portal/` after the workflow completes.

## What Is Included

- Composite dashboard assembled from separate mocked API service calls for customer information, open service tickets, recent orders, and notifications.
- Independent loading and error states for each dashboard block, so one slow or failed stream does not block the rest of the page.
- Global search input that debounces user input and concurrently queries products, knowledge articles, and support tickets with `Promise.all`.
- Radix Popover notification panel with an unread counter, periodic refresh, per-notification "Mark read" action, and an "Unread only" filter toggle.
- Accessible form labels, button labels, live regions, focus states, semantic headings, and keyboard-friendly controls.

## Component & Data Architecture

- `src/lib/mockPortalApi.ts` owns the typed mocked service layer and simulates independent API latency.
- `src/lib/delay.ts` provides the reusable abort-aware latency helper for mocked API calls.
- `src/hooks/useCustomer.ts`, `src/hooks/useTickets.ts`, and `src/hooks/useOrders.ts` wrap individual async resources.
- `src/hooks/useDashboardData.ts` and `src/hooks/useGlobalSearch.ts` compose resource hooks and keep async orchestration out of UI components.
- `src/hooks/useNotificationState.ts` owns notification polling, optimistic read updates, and local read-state merging. `NotificationsProvider` exposes that state, while `src/hooks/useNotifications.ts` is the consumer hook used by dashboard components.
- `src/components/NotificationCenter.tsx` uses Radix Popover for accessible overlay behavior.
- `src/components/*` contains focused dashboard primitives and sections styled with Tailwind utilities.
- `src/lib/cn.ts` combines `clsx` and `tailwind-merge` for predictable conditional class names.

## Design Tokens & Brand Adherence

The styling in `src/index.css` adapts the provided token package into CSS custom properties. Primitive values such as gray, blue, red, green, orange, spacing, radius, and font tokens are exposed first, then consumed through semantic variables such as `--background-surface`, `--text-primary`, `--border-subtle`, and `--background-primary`.

Tailwind v4 theme aliases expose semantic token utilities such as `bg-surface`, `border-border-subtle`, `text-text-primary`, `bg-status-pending`, and `rounded-control`. This keeps components free from hard-coded brand colors while allowing a theme update to flow through the UI.

The supplied spacing scale is mapped directly to Tailwind's numbered spacing utilities: `gap-3`, `p-5`, and `px-6` resolve to `--space-3`, `--space-5`, and `--space-6`. Fixed component dimensions that do not exist in the spacing scale, such as the 42px search control height, intentionally use explicit utilities such as `min-h-[42px]`.

Typography utilities map to the supplied Inter sizes and weights. `text-xs` through `text-2xl` use the primitive font-size tokens, while semantic heading and label pairs use utilities such as `text-heading-2`, `font-heading-2`, `text-label-small`, and `font-label-small`. Surface, control, and pill radii are likewise mapped to `rounded-surface`, `rounded-control`, and `rounded-pill`.

Focus styling is centralized in the `focus-ring` utility, which reads the supplied focus color, width, offset, and style tokens. Status dots use `StatusIndicator` with token-backed `bg-status-*` colors, but always appear alongside written status text so color is never the only signal.

The result follows the task's dashboard-first emphasis: restrained surfaces, compact operational data, clear status feedback, visible focus rings, and predictable responsive layouts.
