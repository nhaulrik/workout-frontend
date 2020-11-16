import {Component, Input, OnInit} from '@angular/core';
import {Exercise} from '../../../../../core/database/_models/exercise';
import {WorkoutSetService} from '../../../../../core/database';
import {ExerciseService} from '../../../../../core/database/_services/exercise.service';
import {GraphQlResponse} from '../../../../../core/database/_models/graphQlResponse';
import {WorkoutSet} from '../../../../../core/database/_models/workoutSet';
import {Session} from '../../../../../core/database/_models/session';

@Component({
	selector: 'kt-session-table',
	templateUrl: './session-table.component.html',
	styleUrls: ['./session-table.component.scss'],
	providers: [WorkoutSetService, ExerciseService]
})
export class SessionTableComponent implements OnInit {
	exerciseDictionary: Exercise[] = [];
	exerciseAmount: number = 1;
	defaultWorkoutSetAmount: number[] = [0, 1, 2, 3, 4];

	firstExerciseId: string;

	sessionId: string;
	userId: string;

	sessionExercises: Map<number, string> = new Map <number, string>();
	workoutSetMap: Map<string, WorkoutSet[]> = new Map<string, WorkoutSet[]>();

	@Input() session: Session;

	constructor(private exerciseService: ExerciseService, private workoutSetService: WorkoutSetService) {
	}

	ngOnInit() {
		this.sessionExercises.set(0,"bla");
		this.getExercises();
		// this.setInitialExerciseMap();
		// // this.populateTableWithWorkoutSet(this.session.workoutSet);
		// this.sessionId = this.session.id;
		// this.userId = this.session.userId;
	}

	// setInitialExerciseMap() {
	// 	var amount = Array(this.exerciseAmount).fill(0).map((x, i) => i); // [1,2,3,4]
	// 	for (var exerciseNumber of amount) {
	// 		this.exerciseMap.set(exerciseNumber, new Map());
	//
	// 		for (var counter: number = 0; counter < 5; counter++) {
	// 			this.exerciseMap.get(exerciseNumber).set(counter, {
	// 				'sessionId': null,
	// 				'id': null,
	// 				'exerciseId': null,
	// 				'repetitions': 0,
	// 				'repetitionMaximum': 0,
	// 				'setNumber': counter,
	// 				'weight': 0
	// 			});
	// 		}
	// 	}
	// }

	// getExerciseForIndex(index: number) {
	//
	// 	const exerciseId = this.exerciseMap.get(index).get(0).exerciseId
	//
	// 	for (let exercise of this.exerciseDictionary) {
	// 		if (exercise.id == exerciseId) {
	// 			return exercise.name;
	// 		}
	// 	}
	// 	return '';
	// }

	// getExerciseIdForIndex(index: number): string {
	//
	// 	const exerciseId = this.exerciseMap.get(index).get(0).exerciseId
	//
	// 	for (let exercise of this.exerciseDictionary) {
	// 		if (exercise.id == exerciseId) {
	// 			return exercise.id;
	// 		}
	// 	}
	// 	return null;
	// }

	// issue with not resetting exercise column when switching date.

	// populateTableWithWorkoutSet(workoutSet: WorkoutSet[]) {
	//
	// 	const exerciseMap = new Map<string, WorkoutSet[]>();
	//
	// 	if (workoutSet != null) {
	// 		for (let ws of workoutSet) {
	// 			if (exerciseMap.get(ws.exerciseId) != undefined) {
	// 				exerciseMap.get(ws.exerciseId).push(ws);
	// 			} else {
	// 				exerciseMap.set(ws.exerciseId, [ws]);
	// 			}
	// 		}
	// 	} else {
	// 		//If we load a session with no workout data, we need to populate the table with empty data;
	// 		this.setInitialExerciseMap();
	// 	}
	// 	var exerciseIndex = 0;
	// 	exerciseMap.forEach((workoutSetArray: WorkoutSet[], key: string) => {
	// 		for (let ws of workoutSetArray) {
	// 			this.exerciseMap.get(exerciseIndex).set(ws.setNumber, { //-1 to compensate for index start at 0 and setnumber at 1
	// 				'sessionId': ws.sessionId,
	// 				'id': ws.id,
	// 				'exerciseId': ws.exerciseId,
	// 				'repetitions': ws.repetitions,
	// 				'repetitionMaximum': ws.repetitionMaximum,
	// 				'setNumber': ws.setNumber,
	// 				'weight': ws.weight
	// 			})
	// 		}
	// 		exerciseIndex++;
	// 	});
	// }

	// shouldShowInput(exerciseIndex: number, setIndex: number) {
	// 	const hasData =
	// 		(this.exerciseMap.get(exerciseIndex).get(setIndex).repetitions > 0 ||
	// 			this.exerciseMap.get(exerciseIndex).get(setIndex).weight > 0) ||
	// 		this.exerciseMap.get(exerciseIndex).get(0).exerciseId != null;
	// 	return hasData;
	// }


	// exerciseUpdated(exerciseIndex, event) {
	//
	// 	const exerciseId = event.value;
	// 	var updatedWorkoutSet: WorkoutSet[] = [];
	//
	// 	this.exerciseMap.get(exerciseIndex).forEach((workoutSet: WorkoutSet, key: number) => {
	//
	// 		if (
	// 			this.hasValue(workoutSet.sessionId) &&
	// 			this.hasValue(workoutSet.exerciseId) &&
	// 			this.hasValue(workoutSet.weight) &&
	// 			this.hasValue(workoutSet.setNumber)
	// 		) {
	// 			updatedWorkoutSet.push(
	// 				{
	// 					'exerciseId': exerciseId,
	// 					'repetitionMaximum': workoutSet.repetitionMaximum,
	// 					'id': workoutSet.id,
	// 					'repetitions': workoutSet.repetitions,
	// 					'weight': workoutSet.weight,
	// 					'setNumber': workoutSet.setNumber,
	// 					'sessionId': this.sessionId
	// 				}
	// 			)
	// 		}
	// 	});
	//
	// 	if (updatedWorkoutSet.length > 0) {
	// 		this.workoutSetService.updateWorkoutSet(
	// 			updatedWorkoutSet
	// 		).subscribe(response => {
	// 			var bla = (response as GraphQlResponse);
	// 		});
	// 	}
	// }
	//
	// hasValue(str) {
	// 	return !(!str || 0 === str.length);
	// }

	// workoutSetUpdated(exerciseIndex: number, setNumber: number) {
	// 	var workoutSet = this.exerciseMap.get(exerciseIndex).get(setNumber);
	// 	if (workoutSet.repetitions > 0 && workoutSet.weight > 0) {
	// 		workoutSet.sessionId = this.sessionId;
	// 		workoutSet.exerciseId = this.getExerciseIdForIndex(exerciseIndex);
	//
	// 		var workoutSetArray = [];
	// 		workoutSetArray.push(workoutSet);
	//
	// 		this.workoutSetService.updateWorkoutSet(
	// 			workoutSetArray
	// 		).subscribe(response => {
	// 			var bla = (response as GraphQlResponse);
	// 			// workoutSet.id = bla.data.addWorkoutSetList[0];
	// 		});
	// 	}
	// }

	getExercises() {
		this.exerciseService.getExercises()
			.subscribe(response => {
				this.exerciseDictionary = (response as GraphQlResponse).data.exercises;
			});
	}

	// deleteWorkoutSet(exerciseIndex: number) {
	// 	var exercise = this.exerciseMap.get(exerciseIndex);
	//
	// 	if (exercise != null) {
	//
	// 		var workoutSetIdsToDelete = [];
	// 		exercise.forEach((workoutSet: WorkoutSet, key: number) => {
	// 			if (workoutSet.id != null) {
	// 				workoutSetIdsToDelete.push(workoutSet.id);
	// 			}
	// 		});
	// 	}
	// }

	debug() {
		debugger;
	}

	addWorkoutSet(exerciseId: string) {

		if (this.workoutSetMap.get(exerciseId) == undefined) {
			this.workoutSetMap.set(exerciseId,[]);
		}

		let workoutSet: WorkoutSet = {
			id: null,
			exerciseId: exerciseId,
			repetitionMaximum: null,
			repetitions: null,
			sessionId: this.sessionId,
			setNumber: this.workoutSetMap.get(exerciseId) == undefined ? 1 : this.workoutSetMap.get(exerciseId).length + 1,
			weight: null
		}
		this.workoutSetMap.get(exerciseId).push(workoutSet);
	}
}
