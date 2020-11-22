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
	getSessionEndpoint = 'http://localhost:9090/api/v1/session/{userId}/{date}';
	getSessionPayload = '{"query":"{\\n sessions (userId:{userId} date:\\"{date}\\") {id localDateTime location programme splitName userId}}","variables": null}';
	getSessionsForMonthPayload = '{"query":"{\\n sessions (month:{month} year:{year} ) {id localDateTime users { id }}}","variables": null}';
	getSessionWithWorkoutSetPayload = '{"query":"{\\n sessions (date:\\"{date}\\") {id localDateTime location programme splitName userId users {\\n      firstName\\n      lastName\\n      gender\\n      birthday   }\\n workoutSet { exerciseId id repetitionMaximum repetitions setNumber single weight sessionId }  }\\n}\\n","variables":null,"operationName":null}';

	postSessionDetailsQuery = '{"query":"mutation {  postSession(    id:\\"{sessionId}\\"  splitName:\\"{splitName}\\"    location: \\"{location}\\"    time: \\"{time}\\"    userId: \\"{userId}\\"    programme: \\"{programme}\\"  )}","variables":null}';


	createSessionQuery = '{"query":"mutation { createSession (date: \\"[date]\\", userIds: [[userIds]])}","variables":null}'

	constructor(private http: HttpClient) {
	}


	getSessionsForDate(date: string) {
		const query = this.getSessionWithWorkoutSetPayload
			.replace('{date}', date);

		return this.http.post(this.graphQLEndpoint, query, httpOptions)
			.pipe(
				catchError(this.handleError)
			)
	}

	getSessionsForMonth(date: Date) {
		let month = date.getMonth() + 1;
		let year = date.getFullYear();
		const query = this.getSessionsForMonthPayload
			.replace('{month}', month.toString())
			.replace('{year}', year.toString());

		return this.http.post(this.graphQLEndpoint, query, httpOptions)
			.pipe(
				catchError(this.handleError)
			)
	}

	formatDateToString(dateObject: Date) {
		if (dateObject != undefined) {
			const date = '{date}-{month}-{year} {hh}:{mm}';

			let hours : number = dateObject.getHours();
			let minutes : number = dateObject.getMinutes();
			let month : number = dateObject.getMonth();
			let day : number = dateObject.getDate();

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

	createSessions(userIds: string[], date: Date) {
		let formattedDate = this.formatDateToString(date);

		var quotedAndCommaSeparated = '\\"' + userIds.join('\\",\\"') + '\\"'.replace('\'', '"');
		let payload = this.createSessionQuery
			.replace('[userIds]', quotedAndCommaSeparated)
			.replace('[date]', formattedDate);

		return this.http.post(this.graphQLEndpoint, payload, httpOptions)
			.pipe(
				catchError(this.handleError)
			)
	}

	postSessionDetails(session: Session) {
		let query = this.postSessionDetailsQuery;
		query = session.splitName != null ? query.replace('{splitName}', session.splitName) : query.replace('{splitName}', null);
		query = session.programme != null ? query.replace('{programme}', session.programme) : query.replace('{programme}', null);
		query = session.id != null ? query.replace('{sessionId}', session.id) : query.replace('{sessionId}', null);
		query = session.localDateTime != null ? query.replace('{time}', this.formatDateToString(new Date(session.localDateTime))) : query.replace('{time}', null);
		query = session.location != null ? query.replace('{location}', session.location) : query.replace('{location}', null);
		query = session.userId != null ? query.replace('{userId}', session.userId) : query.replace('{userId}', null);

		return this.http.post(this.graphQLEndpoint, query, httpOptions)
			.pipe(
				catchError(this.handleError)
			)

	}
}
