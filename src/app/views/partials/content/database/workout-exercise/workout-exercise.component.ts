import {Component, ComponentFactoryResolver, ComponentRef, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {Exercise} from '../../../../../core/database/_models/exercise';
import {ExerciseService} from '../../../../../core/database/_services/exercise.service';
import {GraphQlResponse} from '../../../../../core/database/_models/graphQlResponse';
import {myinterface, WorkoutSetComponent} from '../workout-set/workout-set.component';
import {SessionComponent} from '../session/session.component';

@Component({
	selector: 'kt-workout-exercise',
	templateUrl: './workout-exercise.component.html',
	styleUrls: ['./workout-exercise.component.scss'],
	providers: [ExerciseService]
})
export class WorkoutExerciseComponent implements OnInit, myinterface {
	exerciseDictionary: Exercise[] = [];
	sessionExercises: Map<number, string> = new Map<number, string>();
	exerciseId: string;

	public unique_key: number;
	public parentRef: SessionComponent;

	workoutSetMap: Map<string, number> = new Map<string, number>();
	@ViewChild('viewWorkoutSetRef', {static: false, read: ViewContainerRef}) VCR: ViewContainerRef;

	child_unique_key: number = 0;
	componentsReferences = Array<ComponentRef<WorkoutSetComponent>>()

	constructor(
		private CFR: ComponentFactoryResolver,
		private exerciseService: ExerciseService
	) {
	}

	ngOnInit() {
		this.getExercises();
	}

	createComponent() {
		let componentFactory = this.CFR.resolveComponentFactory(WorkoutSetComponent);

		let childComponentRef = this.VCR.createComponent(componentFactory);

		let childComponent = childComponentRef.instance;
		childComponent.unique_key = ++this.child_unique_key;
		childComponent.parentRef = this;

		childComponent.setNumber = this.componentsReferences.length + 1;
		// add reference for newly created component
		this.componentsReferences.push(childComponentRef);
	}

	remove(key: number) {
		if (this.VCR.length < 1) return;

		let componentRef = this.componentsReferences.filter(
			x => x.instance.unique_key == key
		)[0];

		let vcrIndex: number = this.VCR.indexOf(componentRef as any);

		// removing component from container
		this.VCR.remove(vcrIndex);

		// removing component from the list
		this.componentsReferences = this.componentsReferences.filter(
			x => x.instance.unique_key !== key
		);
	}

	getWorkoutSetAmount(number: number) {
		if (number == undefined) {
			return [];
		}
		return Array(number).fill(0).map((x, i) => i); // [0,1,2,3,4]
	}

	getExercises() {
		this.exerciseService.getExercises()
			.subscribe(response => {
				this.exerciseDictionary = (response as GraphQlResponse).data.exercises;
			});
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

	removeWorkoutExercise() {
		console.log(this.unique_key)
		this.parentRef.remove(this.unique_key)
	}
}

// Interface
export interface myinterface {
	remove(index: number);
}
