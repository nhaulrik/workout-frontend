import {Component, Input, OnInit} from '@angular/core';
import {Exercise} from '../../../../../core/database/_models/exercise';
import {SessionService} from '../../../../../core/database';
import {ExerciseService} from '../../../../../core/database/_services/exercise.service';
import {GraphQlResponse} from '../../../../../core/database/_models/graphQlResponse';
import {WorkoutSet} from '../../../../../core/database/_models/workoutSet';

@Component({
	selector: 'kt-session-table',
	templateUrl: './session-table.component.html',
	styleUrls: ['./session-table.component.scss'],
	providers: [SessionService]
})
export class SessionTableComponent implements OnInit {
	exercises: Exercise[] = [];
	defaultExerciseAmount: number[] = [0, 1, 2, 3, 4, 5, 6, 7];
	defaultWorkoutSetAmount: number[] = [0, 1, 2, 3, 4];

	splitName: string;
	programme: string;
	isEditable: boolean;

	exerciseMap: Map<number, Map<number, WorkoutSet>> = new Map<number, Map<number, WorkoutSet>>();

	@Input() date: any;

	constructor(private exerciseService: ExerciseService) {
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
					'sessionId': 0,
					'id': 0,
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

	populateTableWithWorkoutSet(workoutSet: WorkoutSet[]) {

		const exerciseMap = new Map<string, WorkoutSet[]>();

		for (let ws of workoutSet) {
			if (exerciseMap.get(ws.exerciseId.toString()) != undefined) {
				exerciseMap.get(ws.exerciseId.toString()).push(ws);
			} else {
				exerciseMap.set(ws.exerciseId.toString(), [ws]);
			}
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

		// for (let ws of workoutSet) {
		// 	const wsIndex = workoutSet.indexOf(ws);
		// 	this.exerciseMap.get(wsIndex).set(ws.setNumber - 1, { //-1 to compensate for index start at 0 and setnumber at 1
		// 		'sessionId': ws.sessionId,
		// 		'id': ws.id,
		// 		'exerciseId': ws.exerciseId,
		// 		'repetitions': ws.repetitions,
		// 		'repetitionMaximum': ws.repetitionMaximum,
		// 		'setNumber': ws.setNumber,
		// 		'weight': ws.weight
		// 	})
		// }
	}

	hasOldSession() {
		if (this.date != undefined) {
			const dateIsOld = (
				this.date.getFullYear() <= new Date().getFullYear() &&
				this.date.getMonth() <= new Date().getMonth() &&
				this.date.getDate() < new Date().getDate()
			);

			const hasWorkoutData = (this.exerciseMap != undefined && this.exerciseMap.get(0).get(0).exerciseId != null);

			return dateIsOld && hasWorkoutData;
		}
		return false;
	}

	shouldShowInput(exerciseIndex: number, setIndex: number) {
		const hasData =
			this.exerciseMap.get(exerciseIndex).get(setIndex).repetitions > 0 ||
			this.exerciseMap.get(exerciseIndex).get(setIndex).weight > 0;
		return hasData;
	}

	exerciseEntered(exerciseIndex, event) {
		const exercise = event.value as Exercise;

		for (var workoutSetIndex of this.defaultWorkoutSetAmount) {
			this.exerciseMap.get(exerciseIndex).get(workoutSetIndex).exerciseId = exercise.id;
		}
	}

	getExercises() {
		this.exerciseService.getExercises()
			.subscribe(response => {
				this.exercises = (response as GraphQlResponse).data.exercises;
			});
	}

	debugFunc() {
		debugger;
		// const aaa =123;
	}

}
