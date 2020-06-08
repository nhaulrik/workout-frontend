import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ExerciseService} from '../../../../../../core/database/_services/exercise.service';
import {UserService} from '../../../../../../core/database/_services/user.service';
import {GraphQlResponse} from '../../../../../../core/database/_models/graphQlResponse';
import {Exercise} from '../../../../../../core/database/_models/exercise';
import {SessionTableComponent, UserSelectorComponent} from '../../../../../partials/content/database';
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

	datePickerValue: any = new Date();

	session: Session = this.getEmptySession();
	exercises: Exercise[] = [];
	workoutSet: WorkoutSet[] = [];

	isEditable: boolean = false;

	exerciseMap: Map<number, Map<number, WorkoutSet>> = new Map<number, Map<number, WorkoutSet>>();

	@ViewChild(SessionTableComponent, {static: true}) child;
	@ViewChild(UserSelectorComponent, {static: true}) userSelectorChild;

	constructor(
		private exerciseService: ExerciseService,
		private sessionService: SessionService
	) {
	}

	ngOnInit() {
		this.getExercises();
		this.dateUpdated(new Date());
	}

	getExercises() {
		this.exerciseService.getExercises()
			.subscribe(response => {
				this.exercises = (response as GraphQlResponse).data.exercises
			});
	}

	getSession(date) {
		if (this.session.userId != null) {
			this.sessionService.getSessionWithWorkoutSet(this.session.userId, date)
				.subscribe(response => {
					if ((response as GraphQlResponse).data.sessions.length > 0) {
						this.session = (response as GraphQlResponse).data.sessions[0];
						this.session.localDateTime = new Date((response as GraphQlResponse).data.sessions[0].localDateTime);
						this.child.setInitialExerciseMap();
						this.child.populateTableWithWorkoutSet((response as GraphQlResponse).data.sessions[0].workoutSet);
						this.child.sessionId = (response as GraphQlResponse).data.sessions[0].id;
						this.child.userId = (response as GraphQlResponse).data.sessions[0].userId;
						this.isEditable = false; // disable editing of loaded session
					} else {
						this.session = this.getEmptySession();
						this.child.setInitialExerciseMap();
					}
				});
		}
	}

	sessionIsValid(): boolean {
		var user = this.session != null ? this.session.userId : '';

		return (
			this.hasValue(this.session.localDateTime) &&
			this.hasValue(this.session.programme) &&
			this.hasValue(this.session.location) &&
			this.hasValue(this.session.splitName) &&
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

	dateUpdated(dateObject) {
		if (dateObject != undefined) {
			this.session.localDateTime = dateObject;

			var formattedDate = this.formatDateToString(dateObject);

			// this.session = this.getEmptySession()
			this.child.setInitialExerciseMap();
			this.getSession(formattedDate);
		}
	}

	ngAfterViewInit(): void {
		this.exerciseMap = this.child.exerciseMap;
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
		const sessionIsPersisted = this.session.id != null;
		return sessionIsPersisted;
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
			});
		}
	}

	deleteSession() {
		if (this.session.id != null) {
			this.sessionService.deleteSession(this.session.id).subscribe(response => {
				debugger;
				this.session = this.getEmptySession(this.session.userId)
				this.child.setInitialExerciseMap();
			});
		}
	}

}
