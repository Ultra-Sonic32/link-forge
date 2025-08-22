import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { createUrl, urlDetails } from '../interfaces/url-details.model';
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
}
