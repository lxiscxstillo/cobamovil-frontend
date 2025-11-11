import { RenderMode, ServerRoute } from '@angular/ssr';

// Default to dynamic server rendering for all routes if ever used.
export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Server
  }
];
