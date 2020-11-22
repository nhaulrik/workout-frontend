import {Component, OnInit} from '@angular/core';
import {WorkoutSet} from '../../../../../core/database/_models/workoutSet';
import {WorkoutExerciseComponent} from '..';
import {WorkoutSetService} from '../../../../../core/database';
import {GraphQlResponse} from '../../../../../core/database/_models/graphQlResponse';

@Component({
	selector: 'kt-workout-set',
	templateUrl: './workout-set.component.html',
	styleUrls: ['./workout-set.component.scss'],
	providers: [WorkoutSetService]
})
export class WorkoutSetComponent implements OnInit {

	constructor(
		private workoutSetService: WorkoutSetService
	) {
	}

	public unique_key: number;
	public parentRef: WorkoutExerciseComponent;

	workoutSet: WorkoutSet = {
		id: null,
		exerciseId: null,
		repetitionMaximum: null,
		repetitions: 0,
		sessionId: null,
		setNumber: null,
		weight: 0,
		single: false
	}


	removeWorkoutSet() {
		console.log(this.unique_key)
		this.parentRef.removeWorkoutSetComponent(this.unique_key)
	}

	ngOnInit() {
	}

	deleteWorkoutSet(setNumber: number) {
		if (confirm('Are you sure to delete set number ' + setNumber + '?')) {
			console.log('Implement delete functionality here');
		}
	}

	updateWorkoutSet() {
		this.workoutSetService.postWorkoutSet(this.workoutSet).subscribe(response => {
			let data = (response as GraphQlResponse).data;
		});

	}
}
