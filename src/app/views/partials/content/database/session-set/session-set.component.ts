import {Component, Input, OnInit} from '@angular/core';
import {WorkoutSet} from '../../../../../core/database/_models/workoutSet';

@Component({
	selector: 'kt-session-set',
	templateUrl: './session-set.component.html',
	styleUrls: ['./session-set.component.scss']
})
export class SessionSetComponent implements OnInit {

	constructor() {
	}

	@Input() exerciseId: string;
	@Input() setNumber: number;
	@Input() sessionId: string;
	workoutSet: WorkoutSet = {
		id: null,
		exerciseId: this.exerciseId,
		repetitionMaximum: null,
		repetitions: null,
		sessionId: this.sessionId,
		setNumber: this.setNumber,
		weight: null
	}

	ngOnInit() {
		debugger;
	}

}
