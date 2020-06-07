import {Component, Input, OnInit} from '@angular/core';
import {Exercise} from '../../../../../core/database/_models/exercise';
import {WorkoutSetService} from '../../../../../core/database';
import {ExerciseService} from '../../../../../core/database/_services/exercise.service';
import {GraphQlResponse} from '../../../../../core/database/_models/graphQlResponse';
import {WorkoutSet} from '../../../../../core/database/_models/workoutSet';

@Component({
	selector: 'kt-session-table',
	templateUrl: './session-table.component.html',
	styleUrls: ['./session-table.component.scss'],
	providers: [WorkoutSetService]
})
export class SessionTableComponent implements OnInit {
	exercises: Exercise[] = [];
	defaultExerciseAmount: number[] = [0, 1, 2, 3, 4, 5, 6, 7];
	defaultWorkoutSetAmount: number[] = [0, 1, 2, 3, 4];

	isEditable: boolean;
	sessionId: number;

	exerciseMap: Map<number, Map<number, WorkoutSet>> = new Map<number, Map<number, WorkoutSet>>();

	@Input() tableEnabled: any;
	@Input() hasPersistedSession: boolean;

	constructor(private exerciseService: ExerciseService, private workoutSetService: WorkoutSetService) {
	}

	ngOnInit() {
		this.getExercises();
		this.setInitialExerciseMap();
	}

	setInitialExerciseMap() {
		for (var exerciseNumber of this.defaultExerciseAmount) {
			this.exerciseMap.set(exerciseNumber, new Map());

			for (var counter: number = 0; counter < 5; counter++) {
				this.exerciseMap.get(exerciseNumber).set(counter, {
					'sessionId': null,
					'id': null,
					'exerciseId': null,
					'repetitions': 0,
					'repetitionMaximum': 0,
					'setNumber': counter,
					'weight': 0
				});
			}
		}
	}

	getExerciseForIndex(index: number) {

		const exerciseId = this.exerciseMap.get(index).get(0).exerciseId

		for (let exercise of this.exercises) {
			if (exercise.id == exerciseId) {
				return exercise.name;
			}
		}
		return '';
	}

	getExerciseIdForIndex(index: number): number {

		const exerciseId = this.exerciseMap.get(index).get(0).exerciseId

		for (let exercise of this.exercises) {
			if (exercise.id == exerciseId) {
				return exercise.id;
			}
		}
		return null;
	}

	// issue with not resetting exercise column when switching date.

	populateTableWithWorkoutSet(workoutSet: WorkoutSet[]) {

		const exerciseMap = new Map<string, WorkoutSet[]>();

		if (workoutSet != null) {
			for (let ws of workoutSet) {
				if (exerciseMap.get(ws.exerciseId.toString()) != undefined) {
					exerciseMap.get(ws.exerciseId.toString()).push(ws);
				} else {
					exerciseMap.set(ws.exerciseId.toString(), [ws]);
				}
			}
		} else {
			//If we load a session with no workout data, we need to populate the table with empty data;
			this.setInitialExerciseMap();
		}
		var exerciseIndex = 0;
		exerciseMap.forEach((workoutSetArray: WorkoutSet[], key: string) => {
			for (let ws of workoutSetArray) {
				this.exerciseMap.get(exerciseIndex).set(ws.setNumber - 1, { //-1 to compensate for index start at 0 and setnumber at 1
					'sessionId': ws.sessionId,
					'id': ws.id,
					'exerciseId': ws.exerciseId,
					'repetitions': ws.repetitions,
					'repetitionMaximum': ws.repetitionMaximum,
					'setNumber': ws.setNumber,
					'weight': ws.weight
				})
			}
			exerciseIndex++;
		});
	}

	shouldShowInput(exerciseIndex: number, setIndex: number) {
		const hasData =
			(this.exerciseMap.get(exerciseIndex).get(setIndex).repetitions > 0 ||
				this.exerciseMap.get(exerciseIndex).get(setIndex).weight > 0) ||
			this.exerciseMap.get(exerciseIndex).get(0).exerciseId > 0;
		return hasData;
	}

	exerciseUpdated(exerciseIndex, event) {

		const exerciseId = event.value;
		var updatedWorkoutSet: WorkoutSet[] = [];

		this.exerciseMap.get(exerciseIndex).forEach((workoutSet: WorkoutSet, key: number) => {

			if (
				this.hasValue(workoutSet.sessionId) &&
				this.hasValue(workoutSet.exerciseId) &&
				this.hasValue(workoutSet.repetitionMaximum) &&
				this.hasValue(workoutSet.weight) &&
				this.hasValue(workoutSet.setNumber)
			) {
				updatedWorkoutSet.push(
					{
						'exerciseId': exerciseId,
						'repetitionMaximum': workoutSet.repetitionMaximum,
						'id': workoutSet.id,
						'repetitions': workoutSet.repetitions,
						'weight': workoutSet.weight,
						'setNumber': workoutSet.setNumber,
						'sessionId': this.sessionId
					}
				)
			}
		});

		if (updatedWorkoutSet.length > 0) {
			this.workoutSetService.updateWorkoutSet(
				updatedWorkoutSet
			).subscribe(response => {
				var bla = (response as GraphQlResponse);
			});
		}
	}

	hasValue(str) {
		return !(!str || 0 === str.length);
	}

	workoutSetUpdated(exerciseIndex: number, setNumber: number) {
		var workoutSet = this.exerciseMap.get(exerciseIndex).get(setNumber);
		if (workoutSet.repetitions > 0 && workoutSet.weight > 0) {
			workoutSet.sessionId = this.sessionId;
			workoutSet.setNumber ++; //Otherwise it will start at 0
			workoutSet.exerciseId = this.getExerciseIdForIndex(exerciseIndex);

			var workoutSetArray = [];
			workoutSetArray.push(workoutSet);

			this.workoutSetService.updateWorkoutSet(
				workoutSetArray
			).subscribe(response => {
				var bla = (response as GraphQlResponse);
				workoutSet.id = bla.data.addWorkoutSetList[0];
			});
		}
	}

	getExercises() {
		this.exerciseService.getExercises()
			.subscribe(response => {
				this.exercises = (response as GraphQlResponse).data.exercises;
			});
	}

	deleteWorkoutSet(exerciseIndex: number) {
		var exercise = this.exerciseMap.get(exerciseIndex);

		if (exercise != null) {

			var workoutSetIdsToDelete = [];
			exercise.forEach((workoutSet: WorkoutSet, key: number) => {
				if (workoutSet.id != null) {
					workoutSetIdsToDelete.push(workoutSet.id);
				}
			});
		}
	}
}
