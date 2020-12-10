import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';

import {throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {WorkoutSet} from '../_models/workoutSet';
import {PostWorkoutSetRequest} from '../_models/requests/PostWorkoutSetRequest';

const httpOptions = {
	headers: new HttpHeaders({
		'Content-Type': 'application/json'
	})
};


@Injectable()
export class WorkoutSetService {
	graphQLEndpoint = 'http://localhost:9090/graphql';
	workoutSetControllerEndpoint = 'http://localhost:9090/api/v1/workoutset';
	getWorkoutSetPayload = '{"query":"query {\\n  workoutSet (sessionId:{sessionId} {\\n\\t\\tid\\n    single\\n    repetitionMaximum\\n    repetitions\\n    setNumber\\n    sessionId\\n    weight\\n  }\\n}","variables":null}';

	constructor(private http: HttpClient) {
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

	postWorkoutSet(workoutSet: WorkoutSet, workoutExerciseId: string) {

		let postWorkoutSetRequests: PostWorkoutSetRequest[] = [
			{
				id: workoutSet.id,
				workoutExerciseId: workoutExerciseId,
				repetitions: workoutSet.repetitions,
				repetitionMaximum: workoutSet.repetitionMaximum,
				setNumber: workoutSet.setNumber,
				single: workoutSet.single,
				weight: workoutSet.weight
			}
		]

		return this.http.post(this.workoutSetControllerEndpoint, postWorkoutSetRequests, httpOptions)
			.pipe(
				catchError(this.handleError)
			)
	}

	removeWorkoutSet(id: string) {

		return this.http.delete(this.workoutSetControllerEndpoint + '/' + id, httpOptions)
			.pipe(
				catchError(this.handleError)
			)
	}
}


