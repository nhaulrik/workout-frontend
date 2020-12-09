import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {WorkoutExercise} from '../_models/workoutExercise';
import {throwError} from 'rxjs';
import {PostWorkoutExerciseRequest} from '../_models/requests/PostWorkoutExerciseRequest';

const httpOptions = {
	headers: new HttpHeaders({
		'Content-Type': 'application/json'
	})
};


@Injectable()
export class WorkoutExerciseService {
	graphQLEndpoint = 'http://localhost:9090/graphql';
	workoutExerciseControllerEndpoint = 'http://localhost:9090/api/v1/workoutexercise';

	getWorkoutSetPayload = '{"query":"query {\\n  workoutSet (sessionId:{sessionId} {\\n\\t\\tid\\n    single\\n    repetitionMaximum\\n    repetitions\\n    setNumber\\n    sessionId\\n    weight\\n  }\\n}","variables":null}';

	constructor(private http: HttpClient) {
	}


	getWorkoutExercises() {
		return this.http.post(this.graphQLEndpoint, this.getWorkoutSetPayload, httpOptions)
			.pipe(
				catchError(this.handleError)
			)
	}

	postWorkoutExercise(userId: string, workoutExercise: WorkoutExercise) {
		let postWorkoutExerciseRequests: PostWorkoutExerciseRequest[] = [
			{
				id: workoutExercise.id,
				userId: userId,
				exerciseId: workoutExercise.exerciseId,
				exerciseNumber: workoutExercise.exerciseNumber,
				sessionId: workoutExercise.sessionId,
			}
		];

		return this.http.post(this.workoutExerciseControllerEndpoint, postWorkoutExerciseRequests, httpOptions)
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

	deleteWorkoutExercise(id: string) {
		return this.http.delete(this.workoutExerciseControllerEndpoint + '/' + id, httpOptions)
			.pipe(
				catchError(this.handleError)
			)
	}
}


