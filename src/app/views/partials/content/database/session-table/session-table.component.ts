import {Component, OnInit} from '@angular/core';
import {Exercise} from '../../../../../core/database/_models/exercise';
import {SessionService} from '../../../../../core/database';
import {Session} from '../../../../../core/database/_models/session';
import {ExerciseService} from '../../../../../core/database/_services/exercise.service';
import {GraphQlResponse} from '../../../../../core/database/_models/graphQlResponse';
import {ExerciseForSession} from '../../../../../core/database/_models/exerciseForSession';

@Component({
	selector: 'kt-session-table',
	templateUrl: './session-table.component.html',
	styleUrls: ['./session-table.component.scss'],
	providers: [SessionService]
})
export class SessionTableComponent implements OnInit {
	exercises: Exercise[] = [];
	defaultExerciseAmount: number[] = [0, 1, 2, 3, 4, 5, 6, 7];

	constructor(private exerciseService: ExerciseService) {
		this.session.exercisesForSession[0] = { 'workoutSet': [] };
		this.session.exercisesForSession[1] = { 'workoutSet': [] };
		this.session.exercisesForSession[2] = { 'workoutSet': [] };
		this.session.exercisesForSession[3] = { 'workoutSet': [] };
		this.session.exercisesForSession[4] = { 'workoutSet': [] };
		this.session.exercisesForSession[5] = { 'workoutSet': [] };
		this.session.exercisesForSession[6] = { 'workoutSet': [] };
		this.session.exercisesForSession[7] = { 'workoutSet': [] };
	}


	session: Session = {
		'id': 2,
		'localDateTime': '2020-03-31T16:33',
		'location': 'Home',
		'programme': 'Stronglifts 5x5',
		'splitName': 'split A',
		'userId': null,
		'exercisesForSession': []
		//'workoutSet': new Map()
	};

	ngOnInit() {
		this.getExercises();
	}

	exerciseEntered(exerciseIndex, event) {
		const exercise = event.value as Exercise;
		this.session.exercisesForSession[exerciseIndex].name = exercise.name;
		// this.session.exercisesForWorkout().has(exercise.id)
		// this.session.workoutSet.get(exercise.id)
		const bla = 123;
	}

	getExercises() {
		this.exerciseService.getExercises()
			.subscribe(response => {
				this.exercises = (response as GraphQlResponse).data.exercises;
			});
	}

}
