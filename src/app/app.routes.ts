import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/weather',
    pathMatch: 'full'
  },
  {
    path: 'weather',
    loadComponent: () => import('./pages/weather/dashboard/weather-dashboard.component')
  },
  {
    path: '**',
    redirectTo: '/weather'
  }
];
