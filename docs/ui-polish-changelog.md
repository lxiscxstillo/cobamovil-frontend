# UI Polish Changelog — Coba Móvil

Date: 2025‑11‑12

## Added
- Router scroll restoration and anchor scrolling (app.config.ts).
- Accessible Toasts (`role`/`aria-live`, close button): shared/toast/toast-container.component.ts.
- Loader component: shared/loader/loader.component.ts.
- Skeleton component: shared/skeleton/skeleton.component.ts (not yet wired).
- EmptyState component: shared/empty-state/empty-state.component.ts.

## Changed
- Pets: integrate Loader + EmptyState; no logic changes.
- Landing: rebuild clean structure with Beneficios, Servicios, Galería, Testimonios; normalize accents and JSON‑LD.
- Profile: move regex out of template to TS helpers; normalize copy.
- Register: rebuilt HTML to remove mojibake; keep existing reactive form and API.
- Login: autofocus + aria-invalid + copy cleanup (partial).

## Deferred (Next pass)
- Breadcrumbs, BackToTop, 404/500 pages.
- Modal (accessible) + Undo flows.
- Global :focus-visible and tooltips.
- Form draft persistence and scroll-to-first-error utilities shared.

