import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {HttpErrorResponse} from '@angular/common/http';

import {throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

const httpOptions = {
	headers: new HttpHeaders({
		'Content-Type': 'application/json'
	})
};


@Injectable()
export class UserService {
	getUsersUrl = 'http://localhost:9090/graphql';
	getUsersPayload = '{"query":"{\\n  users {\\n    firstName\\n    lastName\\n    id\\n  }\\n}","variables":null,"operationName":null}';

	constructor(private http: HttpClient) {
	}

	getUsers() {
		return this.http.post(this.getUsersUrl, this.getUsersPayload, httpOptions)
			.pipe(
				catchError(this.handleError)
			)
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