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
	}

	populateTableWithWorkoutSet(workoutSet: WorkoutSet[]) {

		const bla = 123;
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

}
