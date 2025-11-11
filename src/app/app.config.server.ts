import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes, RenderMode } from '@angular/ssr';
import { appConfig } from './app.config';

const serverConfig: ApplicationConfig = {
  providers: [
    // Force dynamic server rendering for all routes, disable build-time prerender.
    provideServerRendering(withRoutes([{ path: '**', renderMode: RenderMode.Server }]))
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
