import {AfterViewInit, Component, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {ExerciseService} from '../../../../../../core/database/_services/exercise.service';
import {UserService} from '../../../../../../core/database/_services/user.service';
import {GraphQlResponse} from '../../../../../../core/database/_models/graphQlResponse';
import {Exercise} from '../../../../../../core/database/_models/exercise';
import {SessionCalendarComponent, SessionTableComponent, UserSelectorComponent} from '../../../../../partials/content/database';
import {WorkoutSet} from '../../../../../../core/database/_models/workoutSet';
import {SessionService} from '../../../../../../core/database';
import {Session} from '../../../../../../core/database/_models/session';

@Component({
	selector: 'kt-session-edit',
	templateUrl: './session-edit.component.html',
	providers: [ExerciseService, UserService],
	styleUrls: ['./session-edit.component.scss'],
})
export class SessionEditComponent implements OnInit, AfterViewInit {

	selectedDate: any = new Date();

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
		private sessionService: SessionService
	) {
	}

	dateChanged(date) {
		this.getSession(date);
	}

	ngOnInit() {
		this.getExercises();
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

		this.sessionService.getSessionWithWorkoutSet(formattedDate)
			.subscribe(response => {
				if ((response as GraphQlResponse).data.sessions.length > 0) {
					this.sessions = (response as GraphQlResponse).data.sessions;
					// check that session is updating correctly when changing dates
					//this.session.localDateTime = new Date((response as GraphQlResponse).data.sessions[0].localDateTime);
					//this.child.setInitialExerciseMap();
					//this.child.populateTableWithWorkoutSet((response as GraphQlResponse).data.sessions[0].workoutSet);
					//this.child.sessionId = (response as GraphQlResponse).data.sessions[0].id;
					//this.child.userId = (response as GraphQlResponse).data.sessions[0].userId;
					this.isEditable = false; // disable editing of loaded session
				} else {
					this.session = this.getEmptySession();
					// this.child.setInitialExerciseMap();r
				}
			});
	}

	sessionIsValid(): boolean {
		var user = this.session != null ? this.session.userId : '';

		return (
			this.hasValue(this.sessions[0].localDateTime) &&
			this.hasValue(this.sessions[0].programme) &&
			this.hasValue(this.sessions[0].location) &&
			this.hasValue(this.sessions[0].splitName) &&
			this.hasValue(user));
	}

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

	getEmptySession(userId: number) {

		var userIdVal = null;
		if (userId != null) {
			userIdVal = userId;
		}

		return {
			'id': null,
			'userId': userIdVal,
			'localDateTime': this.datePickerValue,
			'exerciseMap': new Map<number, Map<number, WorkoutSet>>(),
			'location': '',
			'programme': '',
			'splitName': ''
		};
	}

	hasOldSession() {
		if (this.session.length > 0) {
			const sessionIsPersisted = this.session[0].id != null;
			return sessionIsPersisted;
		}
		return false;
	}

	sessionUpdated() {
		if (this.session.id != null) {
			this.sessionService.addSession(this.session).subscribe(response => {
				debugger;
			});
		}
	}

	createNewSession() {
		let sessionIsValid = this.sessionIsValid();
		let hasExistingSession = this.hasOldSession();

		if (sessionIsValid && !hasExistingSession) {
			this.sessionService.addSession(this.session).subscribe(response => {
				this.session.id = (response as GraphQlResponse).data.addSession;
				this.child.sessionId = this.session.id;
				this.child.userId = this.session.userId;
				this.isEditable = true; // enable editing of newly created session
				this.sessionCalendarChild.updateCalendar();
			});
		}
	}

	deleteSession() {
		if (this.session.id != null) {
			this.sessionService.deleteSession(this.session.id).subscribe(response => {
				debugger;
				this.session = this.getEmptySession(this.session.userId)
				this.child.setInitialExerciseMap();
				this.sessionCalendarChild.updateCalendar();
			});
		}
	}

}
