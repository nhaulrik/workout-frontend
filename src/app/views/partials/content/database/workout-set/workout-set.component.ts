import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, ViewChild} from '@angular/core';
import {WorkoutSet} from '../../../../../core/database/_models/workoutSet';
import {WorkoutExerciseComponent} from '..';
import {WorkoutSetService} from '../../../../../core/database';
import {PostWorkoutSetResponse} from '../../../../../core/database/_models/responses/PostWorkoutSetResponse';

@Component({
	selector: 'kt-workout-set',
	templateUrl: './workout-set.component.html',
	styleUrls: ['./workout-set.component.scss'],
	providers: [WorkoutSetService]
})
export class WorkoutSetComponent implements AfterViewInit {

	constructor(
		private workoutSetService: WorkoutSetService,
		private ref: ChangeDetectorRef
	) {
	}

	public unique_key: number;
	public parentRef: WorkoutExerciseComponent;

	@ViewChild('repetitions', {static: false}) repetitionsField: ElementRef;

	workoutSet: WorkoutSet = {
		id: null,
		repetitionMaximum: null,
		repetitions: 0,
		setNumber: null,
		weight: 0,
		single: false
	}


	removeWorkoutSet() {

		if (this.parentRef.parentRef.sessionLock == 'Lock') {
			this.parentRef.parentRef.showSnackBar('cannot delete locked workout set');
			return;
		}

		console.log(this.unique_key)
		this.workoutSetService.removeWorkoutSet(this.workoutSet.id).subscribe(response => {
		});
		this.parentRef.removeWorkoutSetComponent(this.unique_key);
	}

	updateWorkoutSet() {
		if (this.workoutSet.setNumber > 0 &&
			this.workoutSet.repetitions > 0 &&
			this.workoutSet.weight > 0) {
			this.workoutSetService.postWorkoutSet(this.workoutSet, this.parentRef.parentRef.session.userId, this.parentRef.workoutExercise.sessionId, this.parentRef.workoutExercise.id).subscribe(response => {
				let id = (response as PostWorkoutSetResponse).postedWorkoutSetIds[0];
				this.workoutSet.id = id;
			});
		}
	}

	ngAfterViewInit(): void {
		this.ref.detectChanges();
		this.repetitionsField.nativeElement.select();
	}
}
