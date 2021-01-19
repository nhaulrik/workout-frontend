import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';

import {throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Exercise} from '../_models/exercise';
import {PostExerciseRequest} from '../_models/requests/PostExerciseRequest';

const httpOptions = {
	headers: new HttpHeaders({
		'Content-Type': 'application/json'
	})
};


@Injectable()
export class ExerciseService {
	getExercisesUrl = 'http://localhost:9090/graphql';
	getExercisesPayload = '{"query":"{\\n  exercises {\\n    name\\n    id\\n    bodyPart\\n    isCompound\\n muscles {\\n      id\\n      name\\n      bodyPart\\n }  }\\n}\\n","variables":null,"operationName":null}';
	exerciseControllerEndpoint = 'http://localhost:9090/api/v1/exercise';


	constructor(private http: HttpClient) {
	}

	getExercises() {
		return this.http.post(this.getExercisesUrl, this.getExercisesPayload, httpOptions)
			.pipe(
				catchError(this.handleError)
			)
	}

	postExercise(exercise: Exercise) {

		let postExerciseRequests: PostExerciseRequest[] = [
			{
				id: exercise.id,
				name: exercise.name,
				bodyPart: exercise.bodyPart,
				isCompound: exercise.isCompound,
				muscleIds: exercise.muscles.map(muscle => muscle.id)
			}
		]

		return this.http.post(this.exerciseControllerEndpoint, postExerciseRequests, httpOptions)
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


	removeMuscleFromExercise(exerciseId: string, muscleId: string) {
		return this.http.delete(this.exerciseControllerEndpoint + '/' + exerciseId + '/' + muscleId, httpOptions)
			.pipe(
				catchError(this.handleError)
			)
	}

	deleteExercise(id: string) {
		return this.http.delete(this.exerciseControllerEndpoint + '/' + id, httpOptions)
			.pipe(
				catchError(this.handleError)
			)
	}
}
