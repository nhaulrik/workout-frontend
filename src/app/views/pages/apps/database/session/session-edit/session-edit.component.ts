import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ExerciseService} from '../../../../../../core/database/_services/exercise.service';
import {UserService} from '../../../../../../core/database/_services/user.service';
import {GraphQlResponse} from '../../../../../../core/database/_models/graphQlResponse';
import {Exercise} from '../../../../../../core/database/_models/exercise';
import {SessionTableComponent} from '../../../../../partials/content/database';
import {WorkoutSet} from '../../../../../../core/database/_models/workoutSet';
import {SessionService} from '../../../../../../core/database';
import {Session} from '../../../../../../core/database/_models/session';

import * as _moment from 'moment';
import {FormControl} from '@angular/forms';

const moment = _moment;

@Component({
	selector: 'kt-session-edit',
	templateUrl: './session-edit.component.html',
	providers: [ExerciseService, UserService]

})
export class SessionEditComponent implements OnInit, AfterViewInit {

	date: FormControl = new FormControl(moment());

	session: Session;
	exercises: Exercise[] = [];
	workoutSet: WorkoutSet[] = [];


	exerciseMap: Map<number, Map<number, WorkoutSet>> = new Map<number, Map<number, WorkoutSet>>();

	@ViewChild(SessionTableComponent, {static: true}) child;

	constructor(
		private exerciseService: ExerciseService,
		private sessionService: SessionService
	) {
	}

	ngOnInit() {
		this.getExercises();
		this.session = {
			'localDateTime': '',
			'exerciseMap': {},
			'location': '',
			'programme': '',
			'splitName': '',
			'userId': ''
		};
	}

	getExercises() {
		this.exerciseService.getExercises()
			.subscribe(response => {
				this.exercises = (response as GraphQlResponse).data.exercises
			});
	}

	getSession() {
		this.sessionService.getSession(1, this.session.localDateTime)
			.subscribe(response => {
				this.session = response
			});
	}

	saveWorkout() {

		this.getSession();

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
			const fullMonth = dateObject.getMonth() < 10 ? '0' + dateObject.getMonth() : dateObject.getMonth();
			const formattedDate = date
				.replace('{date}', dateObject.getDate())
				.replace('{month}', fullMonth)
				.replace('{year}', dateObject.getFullYear())
			this.session.localDateTime = formattedDate;
		}
	}

	ngAfterViewInit(): void {
		this.exerciseMap = this.child.session.exerciseMap;
	}

}
