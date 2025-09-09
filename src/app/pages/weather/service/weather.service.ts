import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, timeout} from 'rxjs/operators';
import {format, subDays} from 'date-fns';
import {environment} from '../../../../environments/environment';
import {IWeather, IWeatherChart} from '../model/weather.model';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private readonly baseUrl = environment.weatherApiUrl;
  private readonly requestTimeout = environment.weatherApiTimeout;
  private readonly http = inject(HttpClient);

  getHistoricalWeatherData(latitude: number, longitude: number, days: number = 30): Observable<IWeather> {
    const endDate = new Date();
    const startDate = subDays(endDate, days);

    const params = new HttpParams()
      .set('latitude', latitude.toString())
      .set('longitude', longitude.toString())
      .set('start_date', format(startDate, 'yyyy-MM-dd'))
      .set('end_date', format(endDate, 'yyyy-MM-dd'))
      .set('daily', 'temperature_2m_max,temperature_2m_min')
      .set('timezone', 'auto');

    return this.http.get<IWeather>(this.baseUrl, { params }).pipe(timeout(this.requestTimeout), catchError(this.handleError));
  }

  transformToChartData(weatherData: IWeather): IWeatherChart {
    return {
      labels: weatherData.daily.time.map((date: any) => format(new Date(date), 'MMM dd')),
      datasets: [
        {
          label: `Max Temperature (${weatherData.daily_units.temperature_2m_max})`,
          data: weatherData.daily.temperature_2m_max,
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          tension: 0.4
        },
        {
          label: `Min Temperature (${weatherData.daily_units.temperature_2m_min})`,
          data: weatherData.daily.temperature_2m_min,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4
        }
      ]
    };
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred while fetching weather data.';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 0:
          errorMessage = 'Unable to connect to weather service. Please check your internet connection.';
          break;
        case 400:
          errorMessage = 'Invalid location coordinates provided.';
          break;
        case 429:
          errorMessage = 'Too many requests. Please try again later.';
          break;
        case 500:
          errorMessage = 'Weather service is temporarily unavailable.';
          break;
        default:
          errorMessage = `Server error: ${error.status} - ${error.message}`;
      }
    }

    console.error('Weather Service Error:', error);
    return throwError(() => new Error(errorMessage));
  }
}
