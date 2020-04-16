import {Component, OnInit} from '@angular/core';
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

	exerciseMap: Map<number, Map<number, WorkoutSet>> = new Map<number, Map<number, WorkoutSet>>();

	constructor(private exerciseService: ExerciseService) {
	}

	ngOnInit() {
		this.getExercises();

		this.setInitialExerciseMap();
	}

	setInitialExerciseMap() {
		for (var exerciseNumber: number of this.defaultExerciseAmount) {
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

	populateTableWithWorkoutSet(workoutSet: WorkoutSet[]) {

		for (let ws of workoutSet) {
			const wsIndex = workoutSet.indexOf(ws);
			this.exerciseMap.get(wsIndex).set(ws.setNumber, {
				'sessionId': ws.sessionId,
				'id': ws.id,
				'exerciseId': ws.exerciseId,
				'repetitions': ws.repetitions,
				'repetitionMaximum': ws.repetitionMaximum,
				'setNumber': ws.setNumber,
				'weight': ws.weight
			})
		}
	}

	shouldShowInput(exerciseIndex: number, setIndex: number) {
		const hasData =
			this.exerciseMap.get(exerciseIndex).get(setIndex).repetitions > 0 ||
			this.exerciseMap.get(exerciseIndex).get(setIndex).weight > 0;
		return hasData;
	}

	exerciseEntered(exerciseIndex, event) {
		const exercise = event.value as Exercise;
		this.exerciseMap.set(exerciseIndex, new Map());

		for (var counter: number = 0; counter < 5; counter++) {
			this.exerciseMap.get(exerciseIndex).set(counter, {
				'sessionId': 0,
				'id': 0,
				'exerciseId': exercise.id,
				'repetitions': 0,
				'repetitionMaximum': 1337,
				'setNumber': counter,
				'weight': 0
			});
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
