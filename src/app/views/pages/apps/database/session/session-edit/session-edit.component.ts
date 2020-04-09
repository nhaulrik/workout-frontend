import {AfterViewChecked, AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ExerciseService} from '../../../../../../core/database/_services/exercise.service';
import {UserService} from '../../../../../../core/database/_services/user.service';
import {GraphQlResponse} from '../../../../../../core/database/_models/graphQlResponse';
import {Exercise} from '../../../../../../core/database/_models/exercise';
import {User} from '../../../../../../core/auth';
import {SessionTableComponent} from '../../../../../partials/content/database';
import {WorkoutSet} from '../../../../../../core/database/_models/workoutSet';
import {Session} from '../../../../../../core/database/_models/session';

@Component({
	selector: 'kt-session-edit',
	templateUrl: './session-edit.component.html',
	providers: [ExerciseService, UserService]

})
export class SessionEditComponent implements OnInit, AfterViewInit {
	exercises: Exercise[] = [];
	users: User[] = [];

	workoutSet: WorkoutSet[] = [];

	exerciseMap: Map<number, Map<number, WorkoutSet>> = new Map<number, Map<number, WorkoutSet>>();

	@ViewChild(SessionTableComponent, {static: true}) child;

	constructor(
		private exerciseService: ExerciseService,
		private userService: UserService
	) {
	}

	ngOnInit() {
		this.getExercises();
		this.getUsers();
	}

	getExercises() {
		this.exerciseService.getExercises()
			.subscribe(response => {
				this.exercises = (response as GraphQlResponse).data.exercises
			});
	}

	getUsers() {
		this.userService.getUsers()
			.subscribe(response => {
				this.users = (response as GraphQlResponse).data.users
			});
	}


	saveWorkout() {

		for (let exercise of Array.from(this.exerciseMap.values())) {

			for (let workoutSet of Array.from(exercise.values())) {

				if (workoutSet.weight > 0 && workoutSet.repetitions > 0) {
					this.workoutSet.push({
						'sessionId': 0,
						'id': 0,
						'exerciseId': workoutSet.exerciseId,
						'repetitions': workoutSet.repetitions,
						'repetitionMaximum': workoutSet.repetitionMaximum,
						'setNumber': workoutSet.setNumber,
						'weight': workoutSet.weight,
					});
				}
			}

			const bla2 = 12222;
		}
	}

	ngAfterViewInit(): void {
		this.exerciseMap = this.child.session.exerciseMap;
	}

}
