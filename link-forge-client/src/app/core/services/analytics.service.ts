import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { analytics, analyticsDashboardStats, clicksOverTime } from '../interfaces/analytics.model';
import { urlDetails } from '../interfaces/url-details.model';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  private readonly baseUrl = `${environment.apiUrl}/analytics`;

  constructor(private http: HttpClient) {}

  getDashboardStats(): Observable<analyticsDashboardStats> {
    return this.http.get<analyticsDashboardStats>(`${this.baseUrl}/dashboardStats`);
  }

  getRecentAccessLogs(): Observable<analytics[]> {
    return this.http.get<analytics[]>(`${this.baseUrl}/recentAccessLogs`);
  }

  getclickOverTime(): Observable<clicksOverTime[]> {
    return this.http.get<clicksOverTime[]>(`${this.baseUrl}/clickOverTime`);
  }

  gettopShortUrl(): Observable<urlDetails[]> {
    return this.http.get<urlDetails[]>(`${this.baseUrl}/topShortUrl`);
  }
}
