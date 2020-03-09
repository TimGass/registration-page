import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";

import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class ApiService {
  private SERVER_URL = "http://localhost:3000/users";

  constructor(private httpClient: HttpClient) {}

  handleError(error: HttpErrorResponse) {
    let errorMessage = "Unknown error!";
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }

  public getQuery(query) {
    return this.httpClient
      .get(`${this.SERVER_URL}?${query}`)
      .pipe(catchError(this.handleError));
  }

  public sendGetRequest(url) {
    return this.httpClient
      .get(url, {
        observe: "response"
      })
      .pipe(catchError(this.handleError));
  }

  public sendPostRequest(user) {
    return this.httpClient
      .post(this.SERVER_URL, user)
      .pipe(catchError(this.handleError));
  }

  public sendDeleteRequest(id) {
    return this.httpClient
      .delete(`${this.SERVER_URL}/${id}`)
      .pipe(catchError(this.handleError));
  }
}
