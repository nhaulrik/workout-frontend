import {Component, Input, OnInit} from '@angular/core';
import {Exercise} from '../../../../../core/database/_models/exercise';
import {WorkoutSetService} from '../../../../../core/database';
import {ExerciseService} from '../../../../../core/database/_services/exercise.service';
import {GraphQlResponse} from '../../../../../core/database/_models/graphQlResponse';
import {Session} from '../../../../../core/database/_models/session';

@Component({
	selector: 'kt-session-table',
	templateUrl: './session-table.component.html',
	styleUrls: ['./session-table.component.scss'],
	providers: [WorkoutSetService, ExerciseService]
})
export class SessionTableComponent implements OnInit {
	exerciseDictionary: Exercise[] = [];

	sessionId: string;

	sessionExercises: Map<number, string> = new Map<number, string>();
	workoutSetMap: Map<string, number> = new Map<string, number>();

	@Input() session: Session;

	constructor(private exerciseService: ExerciseService, private workoutSetService: WorkoutSetService) {
	}

	getWorkoutSetAmount(number: number) {
		if (number == undefined) {
			return [];
		}
		return Array(number).fill(0).map((x,i)=>i); // [0,1,2,3,4]
	}

	ngOnInit() {
		this.getExercises();
	}

	getExercises() {
		this.exerciseService.getExercises()
			.subscribe(response => {
				this.exerciseDictionary = (response as GraphQlResponse).data.exercises;
			});
	}

	debug() {
		debugger;
	}

	addWorkoutSet(exerciseId: string) {
		let currentAmountOfWorkoutSet = this.workoutSetMap.get(exerciseId);

		if (currentAmountOfWorkoutSet == undefined) {
			this.workoutSetMap.set(exerciseId, 0);
			currentAmountOfWorkoutSet++;
		}

		this.workoutSetMap.set(exerciseId, currentAmountOfWorkoutSet + 1);
	}

	updateExerciseId(exerciseIndex: number, $event: string) {
		let exerciseId = $event;
		let currentAmountOfWorkoutSet = this.workoutSetMap.get(exerciseId);

		let currentExerciseId = this.sessionExercises.get(exerciseIndex)

		if (currentAmountOfWorkoutSet == undefined && currentExerciseId == undefined) {
			currentAmountOfWorkoutSet = 0;
		} else {
			currentAmountOfWorkoutSet = this.workoutSetMap.get(currentExerciseId);
		}

		this.sessionExercises.set(exerciseIndex, exerciseId);
		this.workoutSetMap.set(exerciseId, currentAmountOfWorkoutSet);

	}
}
