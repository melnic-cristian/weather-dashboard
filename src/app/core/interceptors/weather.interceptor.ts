import { Injectable } from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse, HttpErrorResponse} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class WeatherInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    console.log('Weather API Request:', {url: request.url, method: request.method, headers: request.headers.keys().map(key => ({ [key]: request.headers.get(key) })), timestamp: new Date().toISOString()});

    const modifiedRequest = request.clone({setHeaders: {'X-Requested-With': 'Angular'}});

    return next.handle(modifiedRequest).pipe(
      tap({
        next: (event) => {
          if (event instanceof HttpResponse) {
            console.log('Weather API Response:', {status: event.status, statusText: event.statusText, url: event.url, timestamp: new Date().toISOString()});
          }
        },
        error: (error: HttpErrorResponse) => console.error('Weather API Error:', {status: error.status, statusText: error.statusText, url: error.url, error: error.error, timestamp: new Date().toISOString()})
      })
    );
  }
}
