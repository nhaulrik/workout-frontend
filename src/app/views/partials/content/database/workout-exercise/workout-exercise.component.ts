import {
	AfterViewInit,
	ChangeDetectorRef,
	Component,
	ComponentFactoryResolver,
	ComponentRef,
	OnInit,
	ViewChild,
	ViewContainerRef
} from '@angular/core';
import {Exercise} from '../../../../../core/database/_models/exercise';
import {ExerciseService} from '../../../../../core/database/_services/exercise.service';
import {GraphQlResponse} from '../../../../../core/database/_models/graphQlResponse';
import {WorkoutSetComponent} from '../workout-set/workout-set.component';
import {SessionComponent} from '../session/session.component';
import {WorkoutSet} from '../../../../../core/database/_models/workoutSet';
import {WorkoutExerciseService} from '../../../../../core/database/_services/workoutExerciseService';
import {WorkoutExercise} from '../../../../../core/database/_models/workoutExercise';

@Component({
	selector: 'kt-workout-exercise',
	templateUrl: './workout-exercise.component.html',
	styleUrls: ['./workout-exercise.component.scss'],
	providers: [ExerciseService, WorkoutExerciseService]
})
export class WorkoutExerciseComponent implements OnInit, myinterface, AfterViewInit {
	exerciseDictionary: Exercise[] = [];
	workoutExercise: WorkoutExercise = {
		id: null,
		exerciseId: null,
		exerciseNumber: null,
		sessionId: null,
		exercise: null,
		workoutSet: []
	};

	public unique_key: number;
	public parentRef: SessionComponent;

	workoutSetMap: Map<string, number> = new Map<string, number>();
	@ViewChild('viewWorkoutSetRef', {static: false, read: ViewContainerRef}) VCR: ViewContainerRef;

	child_unique_key: number = 0;
	componentsReferences = Array<ComponentRef<WorkoutSetComponent>>()

	constructor(
		private CFR: ComponentFactoryResolver,
		private exerciseService: ExerciseService,
		private workoutExerciseService: WorkoutExerciseService,
		private ref: ChangeDetectorRef
	) {
	}

	ngAfterViewInit(): void {
		this.workoutExercise.workoutSet.sort((ws1, ws2) => ws1.setNumber - ws2.setNumber).forEach(workoutSet => {
			this.workoutExercise.exerciseId = this.workoutExercise.exerciseId;
			this.initializeWorkoutSetComponent(workoutSet);
			this.ref.detectChanges();
		})
	}

	ngOnInit() {
		this.getExercises();
	}

	getExercises() {
		this.exerciseService.getExercises()
			.subscribe(response => {
				this.exerciseDictionary = (response as GraphQlResponse).data.exercises
					.sort((ex1, ex2) => ex1.name.localeCompare(ex2.name));
				this.ref.detectChanges();
			});
	}

	removeWorkoutExercise() {
		console.log(this.unique_key)
		this.parentRef.remove(this.unique_key)
		this.workoutExerciseService.removeWorkoutExercise(this.workoutExercise.id).subscribe(response => {
			let data = (response as GraphQlResponse);
		})
	}

	createWorkoutSetComponent() {
		let componentFactory = this.CFR.resolveComponentFactory(WorkoutSetComponent);

		let childComponentRef = this.VCR.createComponent(componentFactory);

		let childComponent = childComponentRef.instance;
		childComponent.unique_key = ++this.child_unique_key;
		childComponent.parentRef = this;

		childComponent.workoutSet.setNumber = this.componentsReferences.length + 1;
		this.componentsReferences.push(childComponentRef);
	}

	initializeWorkoutSetComponent(workoutSet: WorkoutSet) {
		let componentFactory = this.CFR.resolveComponentFactory(WorkoutSetComponent);

		let childComponentRef = this.VCR.createComponent(componentFactory);

		let childComponent = childComponentRef.instance;
		childComponent.unique_key = ++this.child_unique_key;
		childComponent.parentRef = this;

		childComponent.workoutSet = workoutSet;
		this.componentsReferences.push(childComponentRef);
	}

	removeWorkoutSetComponent(key: number) {
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

	updateExerciseId() {
		this.workoutExerciseService.postWorkoutExercise(this.workoutExercise).subscribe(response => {
			let data = (response as GraphQlResponse).data;
			this.workoutExercise.id = data.postWorkoutExercise;
		})
	}

	initializeWorkoutSet(workoutSet: WorkoutSet[]) {
		workoutSet.forEach(workoutSet => {
			this.initializeWorkoutSetComponent(workoutSet);
		});
	}
}

// Interface
export interface myinterface {
	removeWorkoutSetComponent(index: number);
}
