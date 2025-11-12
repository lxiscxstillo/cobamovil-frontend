# UI Polish Plan — Coba Móvil (Angular v20 SSR)

Scope: Frontend only (cobamovil-frontend). Minimal, non-breaking UI/UX improvements aligned with checklist.

## Findings vs Checklist

1) Formularios
- Login/Register: validaciones en vivo, submit con Enter, feedback de error correcto. Falta autofocus, aria-invalid, scroll al primer error en Register; Login ya enfoca primer error.
- Perfil: validación visual OK; regex en template causaba errores SSR (resuelto con helpers TS). Falta autofocus.
- Booking: validaciones presentes; revisar scroll-to-error y resumen.

2) Carga/vacío/error
- Listas (Mascotas, Admin Agenda): no tenían loader ni empty-state accesibles (añadidos Loader/EmptyState en Mascotas).
- Reintentos/backoff: no implementado (pendiente en servicios centrales).

3) Navegación y rutas
- SSR OK; refresh 404 mitigado con vercel.json. Falta breadcrumbs y botón “volver arriba” (plan: componente compartido). Scroll restore activado.

4) Tablas/listas
- Admin Agenda: tabla funcional; faltan sticky header/paginación/filtros persistentes (pendiente, para no romper flujos).

5) Consistencia visual
- Sistema de diseño base con variables ya existe. Faltan estados :focus-visible y tooltips unificados (pendiente).

6) Accesibilidad (A11y)
- Toasts sin aria-live/roles (corregido). Formularios con aria-invalid (Login), Perfil/Registro parcialmente.

7) Rendimiento
- Lazy load de rutas activo. Imágenes con `loading="lazy"` en landing/galería. Falta debounce en búsquedas (no hay vistas con búsqueda extensa).

8) Microinteracciones
- Transiciones base en estilos. Falta Undo en acciones destructivas (pendiente); modal accesible (pendiente).

9) i18n y mensajes
- Textos en español; se observan artefactos de codificación en algunos archivos (limpios en landing/pets/profile/register de forma incremental). i18n centralizado (pendiente).

10) Seguridad visual/UX
- Sin HTML externo peligroso. Pendiente aviso de cierre por inactividad.

## This Iteration — Changes Applied
- Router: scroll restoration + anchor scrolling.
- Toasts: `role`/`aria-live` accesibles + botón cerrAR con “×”.
- Loader + EmptyState componentes reutilizables.
- Mascotas: usa Loader + EmptyState; mantiene lógica intacta.
- Login: autofocus, `aria-invalid`, limpieza parcial de textos.
- Landing: restaurada estructura, acentos, secciones (Beneficios, Servicios, Galería, Testimonios), JSON-LD.
- Perfil/Register: validación sin regex en plantilla (helpers TS) y normalización parcial.

## Next Iteration — Safe Enhancements
- Breadcrumbs compartidos + data de rutas.
- BackToTop flotante.
- Modal accesible para confirmaciones (Undo en delete mascota/rutas admin).
- Páginas 404/500 dedicadas (sin romper SSR).
- Focus visible global y tooltips unificados.
- Persistencia de borradores (localStorage) en formularios largos (booking/pets).

