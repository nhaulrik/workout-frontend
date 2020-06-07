import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';

import {throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Session} from '../_models/session';

const httpOptions = {
	headers: new HttpHeaders({
		'Content-Type': 'application/json'
	})
};

@Injectable()
export class SessionService {
	graphQLEndpoint = 'http://localhost:9090/graphql';
	getSessionPayload = '{"query":"{\\n sessions (userId:{userId} date:\\"{date}\\") {id localDateTime location programme splitName userId}}","variables": null}';
	getSessionWithWorkoutSetPayload = '{"query":"{\\n sessions (userId:{userId} date:\\"{date}\\") {id localDateTime location programme splitName userId workoutSet {\\n      id\\n      repetitionMaximum\\n      repetitions\\n      sessionId\\n      exerciseId\\n      setNumber\\n      single\\n      weight\\n    }\\n  }\\n}\\n","variables":null,"operationName":null}';

	addSessionQuery = '{"query":"mutation {\\n  addSession (\\n    id:{id}     splitName:\\"{splitName}\\"    location:\\"{location}\\"    programme:\\"{programme}\\"    time:\\"{time}\\"    userId:{userId}) }","variables":null}';
	deleteSessionQuery = '{"query":"query {\\n  deleteSessions (ids:[{id}])\\n}\\n","variables":null}'

	constructor(private http: HttpClient) {
	}


	getSessionWithWorkoutSet(userId: number, date: string) {
		const query = this.getSessionWithWorkoutSetPayload
			.replace('{userId}', userId.toString())
			.replace('{date}', date);

		return this.http.post(this.graphQLEndpoint, query, httpOptions)
			.pipe(
				catchError(this.handleError)
			)
	}

	getSession(userId: number, date: string) {
		const query = this.getSessionPayload
			.replace('{userId}', userId.toString())
			.replace('{date}', date);

		return this.http.post(this.graphQLEndpoint, query, httpOptions)
			.pipe(
				catchError(this.handleError)
			)
	}

	addSession(session: Session) {
		var query = this.addSessionQuery;

		var dateObject = this.formatDateToString(session.localDateTime);

		query = query.replace('{splitName}', session.splitName)
			.replace('{location}', session.location)
			.replace('{programme}', session.programme)
			.replace('{time}', dateObject)
			.replace('{userId}', session.userId.toString());

		if (session.id != null) {
			query = query.replace('{id}', session.id.toString());
		} else {
			query = query.replace('{id}', null);
		}

		return this.http.post(this.graphQLEndpoint, query, httpOptions)
			.pipe(
				catchError(this.handleError)
			)
	}

	deleteSession(id: number) {
		var query = this.deleteSessionQuery;

		query = query.replace('{id}', id);

		return this.http.post(this.graphQLEndpoint, query, httpOptions)
			.pipe(
				catchError(this.handleError)
			)
	}

	formatDateToString(dateObject) {
		if (dateObject != undefined && dateObject != '') {
			const date = '{date}-{month}-{year} {hh}:{mm}';
			const fullHours = dateObject.getHours() < 10 ? '0' + dateObject.getHours() : dateObject.getHours();
			const fullMinutes = dateObject.getMinutes() < 10 ? '0' + dateObject.getMinutes() : dateObject.getMinutes();
			const fullMonth = dateObject.getMonth() < 10 ? '0' + (dateObject.getMonth() + 1) : dateObject.getMonth() + 1;
			const fullDay = dateObject.getDate() < 10 ? '0' + dateObject.getDate() : dateObject.getDate();
			const formattedDate = date
				.replace('{date}', fullDay)
				.replace('{month}', fullMonth)
				.replace('{year}', dateObject.getFullYear())
				.replace('{hh}', fullHours)
				.replace('{mm}', fullMinutes);

			return formattedDate;
		}
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
