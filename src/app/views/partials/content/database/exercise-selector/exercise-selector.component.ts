import {Component, OnInit} from '@angular/core';
import {ExerciseService} from '../../../../../core/database/_services/exercise.service';
import {GraphQlResponse} from '../../../../../core/database/_models/graphQlResponse';
import {Exercise} from '../../../../../core/database/_models/exercise';

@Component({
	selector: 'kt-exercise-selector',
	templateUrl: './exercise-selector.component.html',
	providers: [ExerciseService]

})
export class ExerciseSelectorComponent implements OnInit {
	exercises: Exercise[] = [];
	bodyParts: string[];
	bodyPartsMap = new Map();

	constructor(private exerciseService: ExerciseService) {
	}

	ngOnInit() {
		this.getExercises();
	}

	getExercises() {
		this.exerciseService.getExercises()
			.subscribe(response => {
				this.exercises = (response as GraphQlResponse).data.exercises;
				this.bodyParts = [...Array.from(new Set((response as GraphQlResponse).data.exercises.map(exercise => exercise.bodyPart)))]

				this.populateExercisesForBodyparts();
			});
	}

	populateExercisesForBodyparts() {

		for (let bodyPart of this.bodyParts) {
			this.bodyPartsMap.set(bodyPart, []);
		}

		for (let exercise of this.exercises) {
			this.bodyPartsMap.get(exercise.bodyPart).push(exercise);
		}
	}


}
