import {Component, OnInit} from '@angular/core';
import {Exercise} from '../../../../../core/database/_models/exercise';
import {SessionService} from '../../../../../core/database';
import {Session} from '../../../../../core/database/_models/session';
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


	session: Session = {
		'localDateTime': '2020-03-31T16:33',
		'location': 'Home',
		'programme': 'Stronglifts 5x5',
		'splitName': 'split A',
		'userId': null,
		'exerciseMap': new Map(new Map())
	};

	ngOnInit() {
		this.getExercises();
		this.session.exerciseMap = this.exerciseMap;
	}

	exerciseEntered(exerciseIndex, event) {
		const exercise = event.value as Exercise;
		this.session.exerciseMap[exerciseIndex] = new Map<number, WorkoutSet>();
		this.session.exerciseMap[exerciseIndex].exerciseName = exercise.name;

		for (var counter: number = 0; counter < 5; counter++) {
			this.session.exerciseMap[exerciseIndex][counter] = {
				'sessionId': 0,
				'id': 0,
				'exerciseId': exercise.id,
				'repetitions': 0,
				'repetitionMaximum': 1337,
				'setNumber': counter,
				'weight': 0,
				'single': false
			};
		}
	}

	getExercises() {
		this.exerciseService.getExercises()
			.subscribe(response => {
				this.exercises = (response as GraphQlResponse).data.exercises;
			});
	}

	blaFunc() {
		const baaa = 1;
	}
}
