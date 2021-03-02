import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';

import {throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

const httpOptions = {
	headers: new HttpHeaders({
		'Content-Type': 'application/json'
	})
};

@Injectable()
export class IntelligenceService {
	graphQLEndpoint = 'http://localhost:9090/graphql';

	intelligenceQuery = '{"query":"{  exerciseIntelligence(    userId: \\"{userId}\\"     exerciseIds: {exerciseIds}     sessionsBack:{sessionsBack}  ) {    userId    exerciseAverages {      exerciseAverage      exerciseName      setCount    }  }}","variables":null,"operationName":null}';

	constructor(private http: HttpClient) {
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

	getIntelligence(userId: string, sessionsBack: number, exerciseIds: string[]) {

		let quotedAndCommaSeparatedExerciseIds = null;

		if (exerciseIds != null && exerciseIds.length > 0) {
			quotedAndCommaSeparatedExerciseIds = '[\\"' + exerciseIds.join('\\",\\"') + '\\"]';
		}

		let query = this.intelligenceQuery.replace('{userId}', userId);
		query = query.replace('{exerciseIds}', quotedAndCommaSeparatedExerciseIds)
			.replace('{sessionsBack}', sessionsBack.toString());

		return this.http.post(this.graphQLEndpoint, query, httpOptions)
			.pipe(
				catchError(this.handleError)
			)
	}

	formatDateToString(dateObject: Date) {
		if (dateObject != undefined) {
			const date = '{date}-{month}-{year} {hh}:{mm}';

			let hours: number = dateObject.getHours();
			let minutes: number = dateObject.getMinutes();
			let month: number = dateObject.getMonth();
			let day: number = dateObject.getDate();

			const fullHours = dateObject.getHours() < 10 ? '0' + hours : hours;
			const fullMinutes = dateObject.getMinutes() < 10 ? '0' + minutes : minutes;
			const fullMonth = dateObject.getMonth() + 1 < 10 ? '0' + month + 1 : month + 1;
			const fullDay = dateObject.getDate() < 10 ? '0' + day : day.toString();
			const formattedDate = date
				.replace('{date}', fullDay)
				.replace('{month}', fullMonth.toString())
				.replace('{year}', dateObject.getFullYear().toString())
				.replace('{hh}', fullHours.toString())
				.replace('{mm}', fullMinutes.toString());

			return formattedDate;
		}
	}

	getSessionIntelligence(userId: string, sessionsBack: number) {
		let query = '{"query":"{  sessionIntelligence(    userId: \\"{userId}\\"     sessionsBack:{sessionsBack}  ) {    date    totalWeight    userId  }}","variables":null,"operationName":null}';

		query = query.replace('{userId}', userId)
			.replace('{sessionsBack}', sessionsBack.toString());

		return this.http.post(this.graphQLEndpoint, query, httpOptions)
			.pipe(
				catchError(this.handleError)
			)
	}
}
