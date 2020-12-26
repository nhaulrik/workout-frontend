import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {HttpErrorResponse} from '@angular/common/http';

import {throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {User} from '../_models/user';
import {WorkoutSet} from '../_models/workoutSet';
import {PostWorkoutSetRequest} from '../_models/requests/PostWorkoutSetRequest';
import {BodyMeasurements} from '../_models/bodyMeasurements';

const httpOptions = {
	headers: new HttpHeaders({
		'Content-Type': 'application/json'
	})
};


@Injectable()
export class UserService {
	userControllerEndpoint = 'http://localhost:9090/api/v1/user';
	bodyMeasurementControllerEndpoint = 'http://localhost:9090/api/v1/bodymeasurement';
	graphQLEndpoint = 'http://localhost:9090/graphql';
	getUsersPayload = '{"query":"{\\n  users {\\n     id\\n    firstName\\n    lastName\\n    birthday\\n    gender\\n    id\\n  }\\n}","variables":null,"operationName":null}';

	addUserQuery = '{"query":"mutation {\\n  addUser (\\n    firstName:\\"{firstName}\\"    lastName:\\"{lastName}\\"    gender:\\"{gender}\\"    birthday:\\"{birthday}\\"    ) }","variables":null}';


	constructor(private http: HttpClient) {
	}

	getUsers() {
		return this.http.post(this.graphQLEndpoint, this.getUsersPayload, httpOptions)
			.pipe(
				catchError(this.handleError)
			)
	}

	addUser(user: User) {
		var query = this.addUserQuery;
		var birthday = this.formatDateToString(user.birthday);

		query = query.replace('{firstName}', user.firstName)
			.replace('{lastName}', user.lastName)
			.replace('{gender}', user.gender)
			.replace('{birthday}', birthday);

		return this.http.post(this.graphQLEndpoint, query, httpOptions)
			.pipe(
				catchError(this.handleError)
			)
	}

	formatDateToString(dateObject) {
		if (dateObject != undefined && dateObject != '') {
			const date = '{date}-{month}-{year}';
			const fullMonth = dateObject.getMonth() < 10 ? '0' + (dateObject.getMonth() + 1) : dateObject.getMonth() + 1;
			const fullDay = dateObject.getDate() < 10 ? '0' + dateObject.getDate() : dateObject.getDate();
			const formattedDate = date
				.replace('{date}', fullDay)
				.replace('{month}', fullMonth)
				.replace('{year}', dateObject.getFullYear());

			return formattedDate;
		}
	}

	postBodyMeasurements(bodyMeasurements: BodyMeasurements) {

		return this.http.post(this.bodyMeasurementControllerEndpoint, [bodyMeasurements], httpOptions)
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
