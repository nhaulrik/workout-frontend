import {Component, OnInit} from '@angular/core';
import {ExerciseService} from '../../../../../../core/database/_services/exercise.service';
import {GraphQlResponse} from '../../../../../../core/database/_models/graphQlResponse';
import {Exercise} from '../../../../../../core/database/_models/exercise';

@Component({
	selector: 'kt-session-edit',
	templateUrl: './session-edit.component.html',
	providers: [ExerciseService]

})
export class SessionEditComponent implements OnInit {
	exercises: Exercise[] = [];

	constructor(private exerciseService: ExerciseService) {
	}

	ngOnInit() {
		this.getExercises();
	}

	getExercises() {
		this.exerciseService.getExercises()
			.subscribe(response => {
				this.exercises = (response as GraphQlResponse).data.exercises
			});
	}

}
