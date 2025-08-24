import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'urls',
    loadChildren: () => import('./features/urls/urls.module').then((m) => m.UrlsModule),
  },
  {
    path: '',
    redirectTo: 'urls/generateShortUrl',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'urls/generateShortUrl',
  },
];
