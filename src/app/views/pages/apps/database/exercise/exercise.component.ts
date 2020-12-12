import {Component, OnInit} from '@angular/core';
import {ExerciseService} from '../../../../../core/database/_services/exercise.service';
import {Exercise} from '../../../../../core/database/_models/exercise';
import {GraphQlResponse} from '../../../../../core/database/_models/graphQlResponse';

@Component({
	selector: 'kt-exercise',
	templateUrl: './exercise.component.html',
	styleUrls: ['./exercise.component.scss'],
	providers: [ExerciseService],
})
export class ExerciseComponent implements OnInit {
	exercises: Exercise[] = [];

	constructor(
		private exerciseService: ExerciseService,
	) {
	}

	ngOnInit() {
		this.exerciseService.getExercises().subscribe(response => {
			let data = (response as GraphQlResponse).data;
			this.exercises = data.exercises;
		})
	}

}
