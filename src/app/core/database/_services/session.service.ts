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
export class SessionService {
	getSessionUrl = 'http://localhost:9090/graphql';
	getSessionPayload = '{"query":"{\\n sessions (userId:{userId} date:\\"{date}\\") {id localDateTime location programme splitName userId}}","variables": null}';

	constructor(private http: HttpClient) {
	}

	getSession(userId: number, date: string) {
		const query = this.getSessionPayload
			.replace("{userId}", userId.toString())
			.replace("{date}", date);

		return this.http.post(this.getSessionUrl, query, httpOptions)
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
