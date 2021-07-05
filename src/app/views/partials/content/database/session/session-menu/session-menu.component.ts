import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {User} from '../../../../../../core/database/_models/user';
import {SessionService, UserService} from '../../../../../../core/database';
import {GraphQlResponse} from '../../../../../../core/database/_models/graphQlResponse';
import {Session} from '../../../../../../core/database/_models/session';
import {cloneDeep} from 'lodash';
import {PostSessionResponse} from '../../../../../../core/database/_models/responses/PostSessionResponse';
import {WorkoutExerciseService} from '../../../../../../core/database/_services/workoutExerciseService';
import {WorkoutExercise} from '../../../../../../core/database/_models/workoutExercise';
import {PostWorkoutExerciseResponse} from '../../../../../../core/database/_models/responses/PostWorkoutExerciseResponse';

@Component({
	selector: 'kt-session-menu',
	templateUrl: './session-menu.component.html',
	styleUrls: ['./session-menu.component.scss'],
	providers: [UserService, SessionService, WorkoutExerciseService],
})
export class SessionMenuComponent implements OnInit {

	@Input() session: Session;
	@Output() sessionsChangedEvent = new EventEmitter<string>();

	users: User[] = [];

	constructor(
		private userService: UserService,
		private sessionService: SessionService,
		private workoutExerciseService: WorkoutExerciseService) {
	}


	deleteSession(): void {
		this.sessionService.deleteSession(this.session.id).subscribe(response => {
			let deleted = (response as GraphQlResponse);
			if (deleted) {
				this.sessionsChangedEvent.emit('');
			}
		})
	}

	duplicateSession(user: User): void {

		let duplicatedSession = cloneDeep(this.session);
		duplicatedSession.userId = user.id;
		duplicatedSession.user = user;
		duplicatedSession.id = null;

		this.sessionService.postSession(duplicatedSession).subscribe(response => {
			const sessionId = (response as PostSessionResponse).postedSessionIds[0];
			duplicatedSession.id = sessionId;

			this.sessionService.getSession(this.session.id).subscribe(response => {
				let session = (response as GraphQlResponse).data.sessions[0];

				let workoutExercises: WorkoutExercise[] = session.workoutExercises.map(we => {
					return {
						id: null,
						sessionId: sessionId,
						isWarmup: we.isWarmup,
						exerciseId: we.exerciseId,
						exerciseNumber: we.exerciseNumber,
						exercise: null,
						workoutSet: []
					}
				});

				if (sessionId != null) {
					workoutExercises.forEach(we => {
						this.workoutExerciseService.postWorkoutExercise(we).subscribe(response => {
							let graphQlResponse = (response as PostWorkoutExerciseResponse);
							we.id = graphQlResponse.postedWorkoutExerciseIds[0];
						});
					})
					this.sessionsChangedEvent.emit('');
				}
			});

		});
	}


	ngOnInit(): void {
		this.userService.getUsers().subscribe(response => {
			this.users = (response as GraphQlResponse).data.users;
		});
	}

}
