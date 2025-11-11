import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/ssr';
import { appConfig } from './app.config';

const serverConfig: ApplicationConfig = {
  providers: [
    // Keep SSR enabled for runtime, but do not force prerender routes at build.
    provideServerRendering()
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
