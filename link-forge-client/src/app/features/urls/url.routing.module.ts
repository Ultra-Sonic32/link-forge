import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'generateShortUrl',
        loadComponent: () => import('./generate-short-url/generate-short-url.component'),
      },
      {
        path: 'viewAll',
        loadComponent: () => import('./view-all/view-all.component'),
      },
      {
        path: 'analytics',
        loadComponent: () => import('./analytics/analytics.component'),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UrlsRoutingModule {}
