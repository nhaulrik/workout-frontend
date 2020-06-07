import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ExerciseService} from '../../../../../../core/database/_services/exercise.service';
import {UserService} from '../../../../../../core/database/_services/user.service';
import {GraphQlResponse} from '../../../../../../core/database/_models/graphQlResponse';
import {Exercise} from '../../../../../../core/database/_models/exercise';
import {SessionTableComponent} from '../../../../../partials/content/database';
import {WorkoutSet} from '../../../../../../core/database/_models/workoutSet';
import {SessionService} from '../../../../../../core/database';
import {Session} from '../../../../../../core/database/_models/session';
import {WorkoutSetService} from '../../../../../../core/database/_services/workoutSet.service';

@Component({
	selector: 'kt-session-edit',
	templateUrl: './session-edit.component.html',
	providers: [ExerciseService, UserService]

})
export class SessionEditComponent implements OnInit, AfterViewInit {

	datePickerValue: any = new Date();

	session: Session = this.getEmptySession();
	exercises: Exercise[] = [];
	workoutSet: WorkoutSet[] = [];


	exerciseMap: Map<number, Map<number, WorkoutSet>> = new Map<number, Map<number, WorkoutSet>>();

	@ViewChild(SessionTableComponent, {static: true}) child;

	constructor(
		private exerciseService: ExerciseService,
		private sessionService: SessionService,
		private workoutSetService: WorkoutSetService
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
		this.sessionService.getSessionWithWorkoutSet(1, date)
			.subscribe(response => {
				if ((response as GraphQlResponse).data.sessions.length > 0) {
					this.session = (response as GraphQlResponse).data.sessions[0];

					this.child.populateTableWithWorkoutSet((response as GraphQlResponse).data.sessions[0].workoutSet);
					this.child.sessionId = (response as GraphQlResponse).data.sessions[0].id;
				} else {
					this.session = this.getEmptySession();
					this.initCreateSession();
					this.child.setInitialExerciseMap();
				}
			});
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

	getWorkoutSet(sessionId: number) {
		this.workoutSetService.getWorkoutSetById(sessionId)
			.subscribe(response => {
				if ((response as GraphQlResponse).data.workoutSet.length > 0) {
					const bla = (response as GraphQlResponse).data.workoutSet;
				}
			})
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

			this.getSession(formattedDate);
		}
	}

	ngAfterViewInit(): void {
		this.exerciseMap = this.child.exerciseMap;
	}

	getEmptySession() {
		return {
			'id': null,
			'userId': 1,
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

	createNewSession() {
		let sessionIsValid = this.sessionIsValid();
		let hasExistingSession = this.hasOldSession();

		if (sessionIsValid && !hasExistingSession) {
			this.sessionService.addSession(this.session).subscribe(response => {
				debugger;
			});
		}
	}

}
