import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';

import {throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {BodyMeasurements} from '../_models/bodyMeasurements';

const httpOptions = {
	headers: new HttpHeaders({
		'Content-Type': 'application/json'
	})
};

@Injectable()
export class BodyMeasurementService {
	graphQLEndpoint = 'http://localhost:9090/graphql';

	getBodyMeasurementsPayload = '{"query":"{  bodyMeasurements (userId: \\"{userId}\\") {    id    userId    date    weight    chest    hip    waist    stomach    leftBiceps    rightBiceps    leftCalve    rightCalve    leftForearm    rightForearm    leftThigh    rightThigh  }}","variables":null,"operationName":null}';

	bodyMeasurementControllerEndpoint = 'http://localhost:9090/api/v1/bodymeasurement';

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

	postBodyMeasurements(bodyMeasurements: BodyMeasurements) {

		bodyMeasurements.dateString = this.formatDateToFullString(bodyMeasurements.date);
		return this.http.post(this.bodyMeasurementControllerEndpoint, [bodyMeasurements], httpOptions)
			.pipe(
				catchError(this.handleError)
			)
	}

	deleteBodyMeasurement(id: string) {
		return this.http.delete(this.bodyMeasurementControllerEndpoint + '/' + id, httpOptions)
			.pipe(
				catchError(this.handleError)
			)
	}

	getBodyMeasurements(userId: string) {
		let query = this.getBodyMeasurementsPayload.replace('{userId}', userId)
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
}
