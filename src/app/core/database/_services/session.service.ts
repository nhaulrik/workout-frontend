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
	getSessionWithWorkoutSetPayload = '{"query":"{\\n sessions (date:\\"{date}\\") {id localDateTime location programme splitName userId users {\\n      firstName\\n      lastName\\n      gender\\n      birthday    }\\n  }\\n}\\n","variables":null,"operationName":null}';

	addSessionQuery = '{"query":"mutation {\\n  addSession (\\n    id:{id}     splitName:\\"{splitName}\\"    location:\\"{location}\\"    programme:\\"{programme}\\"    time:\\"{time}\\"    userId:{userId}) }","variables":null}';
	deleteSessionQuery = '{"query":"query {\\n  deleteSessions (ids:[{id}])\\n}\\n","variables":null}'

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

	getSession(userId: string, date: string) {
		const query = this.getSessionPayload
			.replace('{userId}', userId.toString())
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

	addSession(session: Session) {
		var query = this.addSessionQuery;

		var dateObject = this.formatDateToString(session.localDateTime);

		query = query.replace('{splitName}', session.splitName)
			.replace('{location}', session.location)
			.replace('{programme}', session.programme)
			.replace('{time}', dateObject)
			.replace('{userId}', session.userId);

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

		query = query.replace('{id}', id.toString());

		return this.http.post(this.graphQLEndpoint, query, httpOptions)
			.pipe(
				catchError(this.handleError)
			)
	}

	formatDateToString(dateObject) {
		if (dateObject != undefined && dateObject != '') {
			const date = '{date}-{month}-{year} {hh}:{mm}';

			let hours = dateObject.getHours;
			let minutes = dateObject.getMinutes();
			let month = dateObject.getMonth();
			let day = dateObject.getDate();

			const fullHours = dateObject.getHours() < 10 ? '0' + hours : hours;
			const fullMinutes = dateObject.getMinutes() < 10 ? '0' + minutes : minutes;
			const fullMonth = dateObject.getMonth() + 1 < 10 ? '0' + month + 1 : month + 1;
			const fullDay = dateObject.getDate() < 10 ? '0' + day : date;
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

	createSessions(userIds: string[], date: Date) {
		let formattedDate = this.formatDateToString(date);

		var quotedAndCommaSeparated = "\\\"" + userIds.join("\\\",\\\"") + "\\\"".replace("'", "\"");
		let payload = this.createSessionQuery
			.replace("[userIds]", quotedAndCommaSeparated)
			.replace("[date]", formattedDate);

		return this.http.post(this.graphQLEndpoint, payload, httpOptions)
			.pipe(
				catchError(this.handleError)
			)
	}
}
