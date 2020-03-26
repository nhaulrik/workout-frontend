import {Component, OnInit} from '@angular/core';
import {ExerciseService} from '../../../../../../core/database/_services/exercise.service';
import {UserService} from '../../../../../../core/database/_services/user.service';
import {GraphQlResponse} from '../../../../../../core/database/_models/graphQlResponse';
import {Exercise} from '../../../../../../core/database/_models/exercise';
import {User} from '../../../../../../core/auth';

@Component({
	selector: 'kt-session-edit',
	templateUrl: './session-edit.component.html',
	providers: [ExerciseService, UserService]

})
export class SessionEditComponent implements OnInit {
	exercises: Exercise[] = [];
	users: User[] = [];

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

}
