import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';

import {throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Session} from '../_models/session';
import {PostSessionRequest} from '../_models/requests/postSessionRequest';

const httpOptions = {
	headers: new HttpHeaders({
		'Content-Type': 'application/json'
	})
};

@Injectable()
export class SessionService {
	graphQLEndpoint = 'http://localhost:9090/graphql';
	sessionControllerEndpoint = 'http://localhost:9090/api/v1/session';
	getSessionEndpoint = 'http://localhost:9090/api/v1/session/{userId}/{date}';
	getSessionsForMonthPayload = '{"query":"{\\n sessions (month:{month} year:{year} ) {id localDateTime user { id }}}","variables": null}';
	private getSessionWithWorkoutExercisesPayload = '{"query":"{\\n sessions (date:\\"{date}\\") {id localDateTime location programme splitName userId user {\\n      firstName\\n      lastName\\n      gender\\n      birthday   }\\n workoutExercises { exerciseNumber id exerciseId isWarmup sessionId workoutSet {  id repetitionMaximum repetitions setNumber single weight  } }  }\\n}\\n","variables":null,"operationName":null}';

	private getSessionByIdWithWorkoutExercisesPayload = '{"query":"{ sessions (ids:[\\"{id}\\"]) {id localDateTime location programme splitName userId user {      firstName      lastName      gender      birthday   } workoutExercises { exerciseNumber id exerciseId isWarmup sessionId workoutSet {  id repetitionMaximum repetitions setNumber single weight  } }  }}","variables":null,"operationName":null}';


	getSessionWithExerciseIdsAndUsersPayload = '{"query":"{  sessions (date: \\"{date}\\") {    user {      id      firstName      lastName    }    workoutExercises {      exerciseId    }  }}","variables":null,"operationName":null}';


	postSessionRequest =
		'[\n' +
		'    {\n' +
		'        "id" : "{id}",\n' +
		'        "userId" : "{userId}",\n' +
		'        "location" : {location},\n' +
		'        "programme" : {programme},\n' +
		'        "splitName" : {splitName},\n' +
		'    }\n' +
		']';

	constructor(private http: HttpClient) {
	}


	getSessionsForDate(date: string) {
		const query = this.getSessionWithWorkoutExercisesPayload
			.replace('{date}', date);

		return this.http.post(this.graphQLEndpoint, query, httpOptions)
			.pipe(
				catchError(this.handleError)
			)
	}

	getSession(sessionId: string) {
		const query = this.getSessionByIdWithWorkoutExercisesPayload
			.replace('{id}', sessionId);

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

	formatDateToFullString(dateObject: Date) {
		if (dateObject != undefined) {
			const date = '{date}-{month}-{year} {hh}:{mm}';

			let hours: number = dateObject.getHours();
			let minutes: number = dateObject.getMinutes();
			let month: number = dateObject.getMonth();
			let day: number = dateObject.getDate();

			const fullHours = dateObject.getHours() < 10 ? '0' + hours : hours;
			const fullMinutes = dateObject.getMinutes() < 10 ? '0' + minutes : minutes;
			const fullMonth = dateObject.getMonth() + 1 < 10 ? '0' + (month + 1) : month + 1;
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

	formatDateToShortString(dateObject: Date): string {

		if (dateObject != null) {

			const date = '{date}-{month}-{year}';
			const fullMonth = dateObject.getMonth() + 1 < 10 ? '0' + (dateObject.getMonth() + 1) : (dateObject.getMonth() + 1).toString();
			const fullDay = dateObject.getDate() < 10 ? '0' + dateObject.getDate().toString() : dateObject.getDate().toString();
			const formattedDate = date
				.replace('{date}', fullDay)
				.replace('{month}', fullMonth)
				.replace('{year}', dateObject.getFullYear().toString())

			return formattedDate;
		}
		return '';
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
		let formattedDate = this.formatDateToFullString(date);
		let postSessionRequests: PostSessionRequest[] = userIds.map(userId => {
			return {
				userId: userId,
				id: null,
				location: null,
				programme: null,
				splitName: null,
				date: formattedDate
			}
		});

		return this.http.post(this.sessionControllerEndpoint, postSessionRequests, httpOptions)
			.pipe(
				catchError(this.handleError)
			)
	}

	postSession(session: Session) {

		let postSessionRequest: PostSessionRequest[] = [{
			userId: session.userId != null ? session.userId : null,
			id: session.id != null ? session.id : null,
			location: session.location != null ? session.location : null,
			programme: session.programme != null ? session.programme : null,
			splitName: session.splitName != null ? session.splitName : null,
			date: session.localDateTime != null ? this.formatDateToFullString(new Date(session.localDateTime)) : null
		}];

		return this.http.post(this.sessionControllerEndpoint, postSessionRequest, httpOptions)
			.pipe(
				catchError(this.handleError)
			)

	}

	deleteSession(id: string) {
		return this.http.delete(this.sessionControllerEndpoint + '/' + id, httpOptions)
			.pipe(
				catchError(this.handleError)
			)
	}


}
