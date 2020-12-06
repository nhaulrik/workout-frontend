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
export class ExerciseService {
	getExercisesUrl = 'http://localhost:9090/graphql';
	getExercisesPayload = '{"query":"{\\n  exercises {\\n    name\\n    id\\n    bodyPart\\n    isCompound\\n  }\\n}\\n","variables":null,"operationName":null}';
	getExercisesForBodyPartPayload = '{"query":"{\\n  exercises (bodyparts:\\"{bodypart}\\") {\\n    bodyPart\\n    isCompound\\n    name\\n    id\\n  }\\n}","variables":null,"operationName":null}';

	constructor(private http: HttpClient) {
	}

	getExercises() {
		return this.http.post(this.getExercisesUrl, this.getExercisesPayload, httpOptions)
			.pipe(
				catchError(this.handleError)
			)
	}

	getExercisesForBodyPart(bodyPart: string) {
		const query = this.getExercisesForBodyPartPayload.replace("{bodypart}", bodyPart);
		return this.http.post(this.getExercisesUrl, query, httpOptions)
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