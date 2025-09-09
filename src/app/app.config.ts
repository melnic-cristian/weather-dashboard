import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import {HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi} from '@angular/common/http';
import {WeatherInterceptor} from './core/interceptors/weather.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideHttpClient(withInterceptorsFromDi(), withFetch()), {provide: HTTP_INTERCEPTORS, useClass: WeatherInterceptor, multi: true}],
};
