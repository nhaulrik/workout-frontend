import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {HttpErrorResponse, HttpResponse} from '@angular/common/http';

import {throwError} from 'rxjs';
import {catchError, retry} from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable()
export class MuscleService {
  getMusclesUrl = 'http://localhost:9090/graphql';
  getMusclesPayload = '{"query":"{ muscles { name bodyPart id  } }","variables":null,"operationName":null}';

  constructor(private http: HttpClient) {
  }

  getMuscles() {
    return this.http.post(this.getMusclesUrl, this.getMusclesPayload, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }

}
