import {Component, Input, OnInit} from '@angular/core';
import {WorkoutSet} from '../../../../../core/database/_models/workoutSet';
import {WorkoutExerciseComponent} from '..';

@Component({
	selector: 'kt-workout-set',
	templateUrl: './workout-set.component.html',
	styleUrls: ['./workout-set.component.scss']
})
export class WorkoutSetComponent implements OnInit {

	constructor() {
	}

	public unique_key: number;
	public parentRef: WorkoutExerciseComponent;

	@Input() exerciseId: string;
	@Input() setNumber: number;
	@Input() sessionId: string;
	workoutSet: WorkoutSet = {
		id: null,
		exerciseId: this.exerciseId,
		repetitionMaximum: null,
		repetitions: 0,
		sessionId: this.sessionId,
		setNumber: this.setNumber,
		weight: 0
	}

	removeWorkoutSet() {
		console.log(this.unique_key)
		this.parentRef.remove(this.unique_key)
	}

	ngOnInit() {
		debugger;
	}

	deleteWorkoutSet(setNumber: number) {
			if(confirm("Are you sure to delete set number "+setNumber + "?")) {
				console.log("Implement delete functionality here");
			}
	}
}
// Interface
export interface myinterface {
	remove(index: number);
}
