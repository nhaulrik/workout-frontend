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

	datePickerValue: string;

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
		this.session = this.getEmptySession();
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
					this.session.sessionId = (response as GraphQlResponse).data.sessions[0].id;
					this.session.localDateTime = (response as GraphQlResponse).data.sessions[0].localDateTime;
					this.session.location = (response as GraphQlResponse).data.sessions[0].location;
					this.session.splitName = (response as GraphQlResponse).data.sessions[0].splitName;
					this.session.userId = (response as GraphQlResponse).data.sessions[0].userId;
					this.session.programme = (response as GraphQlResponse).data.sessions[0].programme;

					this.child.populateTableWithWorkoutSet((response as GraphQlResponse).data.sessions[0].workoutsets)
					this.child.splitName = (response as GraphQlResponse).data.sessions[0].splitName
					this.child.programme = (response as GraphQlResponse).data.sessions[0].programme
				} else {
					this.session = this.getEmptySession();
					this.child.setInitialExerciseMap();
					this.child.splitName = '';
					this.child.programme = '';
				}
			});
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

	hasOldSession() {
		if (this.date != undefined) {
			const dateIsOld = (
				this.date.getFullYear() <= new Date().getFullYear() &&
				this.date.getMonth() <= new Date().getMonth() &&
				this.date.getDate() < new Date().getDate()
			);

			const hasWorkoutData = (this.session.exerciseMap != undefined && this.session.exerciseMap.size > 0);

			return dateIsOld && hasWorkoutData;
		}
		return false;
	}

	getEmptySession() {
		return {
			'sessionId': 0,
			'userId': 1,
			'localDateTime': '',
			'exerciseMap': new Map<number, Map<number, WorkoutSet>>(),
			'location': '',
			'programme': '',
			'splitName': ''
		};
	}

}
