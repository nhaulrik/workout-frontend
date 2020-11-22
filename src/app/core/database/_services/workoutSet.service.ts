import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {HttpErrorResponse} from '@angular/common/http';

import {throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {WorkoutSet} from '../_models/workoutSet';

const httpOptions = {
	headers: new HttpHeaders({
		'Content-Type': 'application/json'
	})
};


@Injectable()
export class WorkoutSetService {
	graphQLEndpoint = 'http://localhost:9090/graphql';
	getWorkoutSetPayload = '{"query":"query {\\n  workoutSet (sessionId:{sessionId} {\\n\\t\\tid\\n    single\\n    repetitionMaximum\\n    repetitions\\n    setNumber\\n    sessionId\\n    weight\\n  }\\n}","variables":null}';


	postWorkoutSetQuery = '{"query": "mutation {\\n  addWorkoutSet(id: {id}, sessionId: \\"{sessionId}\\", exerciseId: \\"{exerciseId}\\", repetitions: {repetitions}, weight: {weight}, single: {single}, repetitionMaximum: {repetitionMaximum}, setNumber: {setNumber}) \\n}\\n","variables":null}';


addWorkoutSetListTemplate = '{"query": "mutation {\\n  addWorkoutSetList(workoutSet: [{content}]) \\n}\\n","variables":null}'
	addWorkoutSetListObject = '{id: {id}, sessionId: {sessionId}, exerciseId: {exerciseId}, repetitions: {repetitions}, weight: {weight}, single: {single}, repetitionMaximum: {repetitionMaximum}, setNumber: {setNumber}}';

	constructor(private http: HttpClient) {
	}


	getWorkoutSet() {
		return this.http.post(this.graphQLEndpoint, this.getWorkoutSetPayload, httpOptions)
			.pipe(
				catchError(this.handleError)
			)
	}

	getWorkoutSetPartialPayload(workoutSet: WorkoutSet) {

		var workoutSetObject = this.addWorkoutSetListObject;
		workoutSetObject = workoutSetObject
			.replace('{single}', 'false')
			.replace('{repetitionMaximum}', workoutSet.repetitionMaximum.toString())
			.replace('{exerciseId}', workoutSet.exerciseId)
			.replace('{weight}', workoutSet.weight.toString())
			.replace('{sessionId}', workoutSet.sessionId.toString())
			.replace('{repetitions}', workoutSet.repetitions.toString())
			.replace('{setNumber}', workoutSet.setNumber.toString());

		if (workoutSet.id != null) {
			workoutSetObject = workoutSetObject.replace('{id}', workoutSet.id.toString());
		} else {
			workoutSetObject = workoutSetObject.replace('{id}', null);
		}

		return workoutSetObject;
	}

	updateWorkoutSet(
		workoutSet: WorkoutSet[]
	) {

		var mutationObjects = '';
		workoutSet.forEach((ws: WorkoutSet) => {

			if (ws.sessionId != null && ws.exerciseId != null) {
				mutationObjects += this.getWorkoutSetPartialPayload(ws);

				if (workoutSet.indexOf(ws) + 1 != workoutSet.length) {
					mutationObjects += ', ';
				}
			}
		});

		var query = this.addWorkoutSetListTemplate.replace('{content}', mutationObjects);

		return this.http.post(this.graphQLEndpoint, query, httpOptions)
			.pipe(
				catchError(this.handleError)
			)
	}


	getWorkoutSetById(sessionId: number) {
		const query = this.getWorkoutSetPayload
			.replace('{sessionId}', sessionId.toString());

		return this.http.post(this.graphQLEndpoint, query, httpOptions)
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

	postWorkoutSet(workoutSet: WorkoutSet) {
		let query = this.postWorkoutSetQuery;
		query = workoutSet.weight != null ? query.replace('{weight}', workoutSet.weight.toString()) : query.replace('{weight}', null);
		query = workoutSet.repetitions != null ? query.replace('{repetitions}', workoutSet.repetitions.toString()) : query.replace('{repetitions}', null);
		query = workoutSet.id != null ? query.replace('{id}', workoutSet.id.toString()) : query.replace('{id}', null);
		query = workoutSet.single != null ? query.replace('{single}', workoutSet.single.toString()) : query.replace('{single}', null);
		query = workoutSet.setNumber != null ? query.replace('{setNumber}', workoutSet.setNumber.toString()) : query.replace('{setNumber}', null);
		query = workoutSet.repetitionMaximum != null ? query.replace('{repetitionMaximum}', workoutSet.repetitionMaximum.toString()) : query.replace('{repetitionMaximum}', null);
		query = workoutSet.sessionId != null ? query.replace('{sessionId}', workoutSet.sessionId) : query.replace('{sessionId}', null);
		query = workoutSet.exerciseId != null ? query.replace('{exerciseId}', workoutSet.exerciseId) : query.replace('{exerciseId}', null);

		debugger;

		return this.http.post(this.graphQLEndpoint, query, httpOptions)
			.pipe(
				catchError(this.handleError)
			)
	}
}


