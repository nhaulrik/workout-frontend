import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {WorkoutExercise} from '../_models/workoutExercise';
import {throwError} from 'rxjs';

const httpOptions = {
	headers: new HttpHeaders({
		'Content-Type': 'application/json'
	})
};


@Injectable()
export class WorkoutExerciseService {
	graphQLEndpoint = 'http://localhost:9090/graphql';
	getWorkoutSetPayload = '{"query":"query {\\n  workoutSet (sessionId:{sessionId} {\\n\\t\\tid\\n    single\\n    repetitionMaximum\\n    repetitions\\n    setNumber\\n    sessionId\\n    weight\\n  }\\n}","variables":null}';


	postWorkoutExerciseQuery = '{"query": "mutation {  postWorkoutExercise(id: {id}, sessionId: {sessionId}, exerciseId: {exerciseId}, exerciseNumber: {exerciseNumber}) }","variables":null}';

	constructor(private http: HttpClient) {
	}


	getWorkoutExercises() {
		return this.http.post(this.graphQLEndpoint, this.getWorkoutSetPayload, httpOptions)
			.pipe(
				catchError(this.handleError)
			)
	}

	postWorkoutExercise(workoutExercise: WorkoutExercise) {
		let query = this.postWorkoutExerciseQuery;
		query = workoutExercise.id != null ? query.replace('{id}', '\\"' + workoutExercise.id.toString() + '\\"') : query.replace('{id}', null);
		query = workoutExercise.sessionId != null ? query.replace('{sessionId}', '\\"' + workoutExercise.sessionId.toString() + '\\"') : query.replace('{sessionId}', null);
		query = workoutExercise.exerciseId != null ? query.replace('{exerciseId}', '\\"' + workoutExercise.exerciseId.toString() + '\\"') : query.replace('{exerciseId}', null);
		query = workoutExercise.exerciseNumber != null ? query.replace('{exerciseNumber}', workoutExercise.exerciseNumber.toString()) : query.replace('{exerciseNumber}', null);

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

	removeWorkoutExercise(id: string) {
		let query = '{"query": "mutation {\\n  deleteWorkoutExercise (id: \\"{id}\\") \\n}\",\"variables\":null}'
		query = query.replace('{id}', id);

		return this.http.post(this.graphQLEndpoint, query, httpOptions)
			.pipe(
				catchError(this.handleError)
			)
	}
}


