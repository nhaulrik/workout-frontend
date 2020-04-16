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
export class WorkoutSetService {
	endpoint = 'http://localhost:9090/graphql';
	getUsersPayload = 		'{"query":"{\\n  users {\\n    firstName\\n    lastName\\n    id\\n  }\\n}","variables":null,"operationName":null}';
	getWorkoutSetPayload = 	'{"query":"query {\\n  workoutsets (sessionId:{sessionId} {\\n\\t\\tid\\n    single\\n    repetitionMaximum\\n    repetitions\\n    setNumber\\n    sessionId\\n    weight\\n  }\\n}","variables":null}';
	constructor(private http: HttpClient) {
	}


	getWorkoutSet() {
		return this.http.post(this.endpoint, this.getWorkoutSetPayload, httpOptions)
			.pipe(
				catchError(this.handleError)
			)
	}

	getWorkoutSetById(sessionId: number) {
		const query = this.getWorkoutSetPayload
			.replace("{sessionId}", sessionId.toString());

		return this.http.post(this.endpoint, query, httpOptions)
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


