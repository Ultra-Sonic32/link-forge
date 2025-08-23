import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  createUrl,
  resolveShortUrl,
  urlDetails,
  urlFilters,
} from '../interfaces/url-details.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Url {
  private readonly baseUrl = `${environment.apiUrl}/urls`;

  constructor(private http: HttpClient) {}

  //Generate Short Url
  generateShortUrl(url: createUrl): Observable<urlDetails> {
    return this.http.post<urlDetails>(`${this.baseUrl}/generateShortUrl`, url);
  }

  //Resolve Short Url
  resolveShortUrl(shortUrlCode: string): Observable<resolveShortUrl> {
    return this.http.get<resolveShortUrl>(`${this.baseUrl}/resolve/${shortUrlCode}`);
  }

  //Fetch All Short Urls full (can add filters)
  getAllShortUrls(filters?: urlFilters): Observable<urlDetails[]> {
    let queryParams = new HttpParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams = queryParams.set(key, value.toString());
        }
      });
    }
    return this.http.get<urlDetails[]>(`${this.baseUrl}/all`);
  }
}
