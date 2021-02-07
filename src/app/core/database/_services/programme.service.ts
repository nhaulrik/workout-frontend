import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';

import {throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Session} from '../_models/session';
import {PostSessionRequest} from '../_models/requests/postSessionRequest';
import {Programme} from '../_models/programme';
import {PostProgrammeRequest} from '../_models/requests/PostProgrammeRequest';

const httpOptions = {
	headers: new HttpHeaders({
		'Content-Type': 'application/json'
	})
};

@Injectable()
export class ProgrammeService {
	graphQLEndpoint = 'http://localhost:9090/graphql';
	programmeControllerEndpoint = 'http://localhost:9090/api/v1/programme';
	getProgrammeEndpoint = 'http://localhost:9090/api/v1/session/{userId}/{date}';

	constructor(private http: HttpClient) {
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

	postProgramme(programme: Programme) {
		debugger;
		let postProgrammeRequests: PostProgrammeRequest[] = [{
			id: programme.id != null ? programme.id : null
		}];

		return this.http.post(this.programmeControllerEndpoint, postProgrammeRequests, httpOptions)
			.pipe(
				catchError(this.handleError)
			)

	}

}
