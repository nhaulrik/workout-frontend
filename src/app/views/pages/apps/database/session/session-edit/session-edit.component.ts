import {AfterViewInit, Component, OnInit, ViewChild, ViewChildren} from '@angular/core';
import {ExerciseService} from '../../../../../../core/database/_services/exercise.service';
import {UserService} from '../../../../../../core/database/_services/user.service';
import {GraphQlResponse} from '../../../../../../core/database/_models/graphQlResponse';
import {Exercise} from '../../../../../../core/database/_models/exercise';
import {SessionCalendarComponent, SessionTableComponent, UserSelectorComponent} from '../../../../../partials/content/database';
import {WorkoutSet} from '../../../../../../core/database/_models/workoutSet';
import {SessionService} from '../../../../../../core/database';
import {Session} from '../../../../../../core/database/_models/session';
import {User} from '../../../../../../core/database/_models/user';

@Component({
	selector: 'kt-session-edit',
	templateUrl: './session-edit.component.html',
	providers: [ExerciseService, UserService, SessionService],
	styleUrls: ['./session-edit.component.scss'],
})
export class SessionEditComponent implements OnInit, AfterViewInit {

	selectedDate: any = new Date();

	usersToAdd: string[] = [];

	users: User[] = [];
	sessions: Session[] = [];
	exercises: Exercise[] = [];
	workoutSet: WorkoutSet[] = [];

	isEditable: boolean = false;

	exerciseMap: Map<number, Map<number, WorkoutSet>> = new Map<number, Map<number, WorkoutSet>>();

	@ViewChildren(SessionTableComponent) child;
	@ViewChild(UserSelectorComponent, {static: true}) userSelectorChild;
	@ViewChild(SessionCalendarComponent, {static: true}) sessionCalendarChild;

	constructor(
		private exerciseService: ExerciseService,
		private sessionService: SessionService,
		private userService: UserService
	) {
	}

	addUser(userId: string, event: any) {
		if (event.checked) {
			if (!this.usersToAdd.includes(userId)) {
				this.usersToAdd.push(userId);
			}
		} else {
			this.usersToAdd = this.usersToAdd.filter(u => u !== userId);
		}
	}

	dateChanged(date) {
		this.getSession(date);
	}

	ngOnInit() {
		this.getUsers();
		this.getExercises();

		// 			this.sessions = (response as GraphQlResponse).data.sessions.map(s => ({
		// 				id: s.id,
		// 				userId: s.userId,
		// 				location: s.location,
		// 				programme: s.programme,
		// 				splitName: s.splitName,
		// 				localDateTime: s.localDateTime,
		// 				exerciseMap: null
		// 			}));

		this.getSession(new Date());
	}

	getExercises() {
		this.exerciseService.getExercises()
			.subscribe(response => {
				this.exercises = (response as GraphQlResponse).data.exercises
			});
	}

	getSession(date) {
		var formattedDate = this.formatDateToString(date);

		this.sessionService.getSessionsForDate(formattedDate)
			.subscribe(response => {
				if ((response as GraphQlResponse).data.sessions.length > 0) {
					this.sessions = (response as GraphQlResponse).data.sessions.map(s => ({
						id: s.id,
						userId: s.userId,
						location: s.location,
						programme: s.programme,
						splitName: s.splitName,
						localDateTime: s.localDateTime,
						exerciseMap: null
					}));
				}
			});
	}

	// sessionIsValid(): boolean {
	// 	var user = this.session != null ? this.session.userId : '';
	//
	// 	return (
	// 		this.hasValue(this.sessions[0].localDateTime) &&
	// 		this.hasValue(this.sessions[0].programme) &&
	// 		this.hasValue(this.sessions[0].location) &&
	// 		this.hasValue(this.sessions[0].splitName) &&
	// 		this.hasValue(user));
	// }

	hasValue(str) {
		return !(!str || 0 === str.length);
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
		}
	}

	formatDateToString(dateObject) {

		if (dateObject != null && dateObject != '') {

			const date = '{date}-{month}-{year}';
			const fullMonth = dateObject.getMonth() < 10 ? '0' + (dateObject.getMonth() + 1) : dateObject.getMonth() + 1;
			const fullDay = dateObject.getDate() < 10 ? '0' + dateObject.getDate() : dateObject.getDate();
			const formattedDate = date
				.replace('{date}', fullDay)
				.replace('{month}', fullMonth)
				.replace('{year}', dateObject.getFullYear())

			return formattedDate;
		}
		return '';
	}

	ngAfterViewInit(): void {
		// debugger;
		// this.child.changes.subscribe((comps: QueryList<SessionTableComponent>) =>
		// {
		// 	// Now you can access the child component
		// 	this.exerciseMap = this.child.exerciseMap;
		// })
	}

	// hasOldSession() {
	// 	if (this.session.length > 0) {
	// 		const sessionIsPersisted = this.session[0].id != null;
	// 		return sessionIsPersisted;
	// 	}
	// 	return false;
	// }

	// sessionUpdated() {
	// 	if (this.session.id != null) {
	// 		this.sessionService.addSession(this.session).subscribe(response => {
	// 			debugger;
	// 		});
	// 	}
	// }

	// createNewSession() {
	// 	let sessionIsValid = this.sessionIsValid();
	// 	let hasExistingSession = this.hasOldSession();
	//
	// 	if (sessionIsValid && !hasExistingSession) {
	// 		this.sessionService.addSession(this.session).subscribe(response => {
	// 			this.session.id = (response as GraphQlResponse).data.addSession;
	// 			this.child.sessionId = this.session.id;
	// 			this.child.userId = this.session.userId;
	// 			this.isEditable = true; // enable editing of newly created session
	// 			this.sessionCalendarChild.updateCalendar();
	// 		});
	// 	}
	// }

	// deleteSession() {
	// 	if (this.session.id != null) {
	// 		this.sessionService.deleteSession(this.session.id).subscribe(response => {
	// 			debugger;
	// 			this.session = this.getEmptySession(this.session.userId)
	// 			this.child.setInitialExerciseMap();
	// 			this.sessionCalendarChild.updateCalendar();
	// 		});
	// 	}
	// }

	private getUsers() {
		this.userService.getUsers().subscribe(response => {
			if ((response as GraphQlResponse).data.users.length > 0) {
				this.users = (response as GraphQlResponse).data.users;
			}
		})
	}
}
