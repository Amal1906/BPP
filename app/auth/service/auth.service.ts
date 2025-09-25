import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {
   }

   /**
   * Creates and returns HTTP headers with JSON content type
   * @private
   * @returns {HttpHeaders} The configured HTTP headers
   */
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }

  /**
   * Authenticates a user by sending login credentials to the server
   * @param {Object} payload - The user's email address
   * @returns {Observable<any>} An observable that emits the server response
   * @throws Will throw an error if the authentication request fails
   */
  authenticateUser(payload: any): Observable<any> {
    return this.http.post(`login`, payload, { headers: this.getHeaders() }).pipe(
      map((response: any) => response),
      catchError((error: any) => {
        return throwError(() => error);
      })
    );
  }
}