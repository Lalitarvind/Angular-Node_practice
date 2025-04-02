import { APP_INITIALIZER, ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, Router } from '@angular/router';
import { generateRoutes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { customInterceptor } from './interceptor/custom.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ContentService } from './services/content.service';

export function routeGenerator(router:Router, contentService:ContentService ){
  return async () => { await generateRoutes(router,contentService); }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter([]),
    provideHttpClient(withInterceptors([customInterceptor])),
    provideZoneChangeDetection({ eventCoalescing: true }), 
    ContentService,
    {
      provide: APP_INITIALIZER,
      useFactory: routeGenerator,
      deps: [Router, ContentService],
      multi: true
    },
    provideAnimations()
  ]
};
