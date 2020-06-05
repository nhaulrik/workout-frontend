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

	date: any;

	session: Session;
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

	sessionValueChanged() {
		this.session.location = this.child.location;
		this.session.programme = this.child.programme;
		this.session.splitName = this.child.splitName;
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
					this.session.id = (response as GraphQlResponse).data.sessions[0].id;
					this.session.localDateTime = (response as GraphQlResponse).data.sessions[0].localDateTime;
					this.session.location = (response as GraphQlResponse).data.sessions[0].location;
					this.session.splitName = (response as GraphQlResponse).data.sessions[0].splitName;
					this.session.userId = (response as GraphQlResponse).data.sessions[0].userId;
					this.session.programme = (response as GraphQlResponse).data.sessions[0].programme;

					this.child.populateTableWithWorkoutSet((response as GraphQlResponse).data.sessions[0].workoutSet);
					this.child.splitName = (response as GraphQlResponse).data.sessions[0].splitName;
					this.child.programme = (response as GraphQlResponse).data.sessions[0].programme;
					this.child.sessionId = (response as GraphQlResponse).data.sessions[0].id;
					this.child.location = (response as GraphQlResponse).data.sessions[0].location;
				} else {
					this.session = this.getEmptySession();
					this.initCreateSession();
					this.child.setInitialExerciseMap();
					this.child.splitName = '';
					this.child.programme = '';
					this.child.location = '';
				}
			});
	}

	//location is not updating when accessing old session


	initCreateSession() {
		var date = this.date;
		var programme = this.child.programme;
		var location = this.child.location;
		var split = this.child.splitName;
		var user = this.session.userId;
		if (
			this.hasValue(date) &&
			this.hasValue(programme) &&
			this.hasValue(location) &&
			this.hasValue(split) &&
			this.hasValue(user)
		) {
			debugger;
		}
	}

	sessionIsValid(): boolean {
		var date = this.date;
		var programme = this.child.programme;
		var location = this.child.location;
		var split = this.child.splitName;
		var user = this.session != null ? this.session.userId : '';

		return (this.hasValue(date) &&
			this.hasValue(programme) &&
			this.hasValue(location) &&
			this.hasValue(split) &&
			this.hasValue(user));
	}


	hasValue(str) {
		return !(!str || 0 === str.length);
	}

	getWorkoutSet(sessionId
					  :
					  number
	) {
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

	dateUpdated(dateObject) {
		if (dateObject != undefined) {
			const date = '{date}-{month}-{year}';
			const fullMonth = dateObject.getMonth() < 10 ? '0' + (dateObject.getMonth() + 1) : dateObject.getMonth() + 1;
			const fullDay = dateObject.getDate() < 10 ? '0' + dateObject.getDate() : dateObject.getDate();
			const formattedDate = date
				.replace('{date}', fullDay)
				.replace('{month}', fullMonth)
				.replace('{year}', dateObject.getFullYear())

			this.getSession(formattedDate);

			this.date = dateObject;
		}
	}

	ngAfterViewInit(): void {
		this.exerciseMap = this.child.exerciseMap;
	}

	getEmptySession() {
		return {
			'id': 0,
			'userId': 1,
			'localDateTime': '',
			'exerciseMap': new Map<number, Map<number, WorkoutSet>>(),
			'location': '',
			'programme': '',
			'splitName': ''
		};
	}

}
