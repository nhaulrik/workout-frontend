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
import {WorkoutSetComponent} from '../workout-set/workout-set.component';
import {SessionComponent} from '../session/session.component';
import {WorkoutSet} from '../../../../../core/database/_models/workoutSet';
import {WorkoutExerciseService} from '../../../../../core/database/_services/workoutExerciseService';
import {WorkoutExercise} from '../../../../../core/database/_models/workoutExercise';
import {PostWorkoutExerciseResponse} from '../../../../../core/database/_models/responses/PostWorkoutExerciseResponse';

@Component({
	selector: 'kt-workout-exercise',
	templateUrl: './workout-exercise.component.html',
	styleUrls: ['./workout-exercise.component.scss'],
	providers: [WorkoutExerciseService]
})
export class WorkoutExerciseComponent implements OnInit, myinterface, AfterViewInit {
	exerciseDictionary: Exercise[] = [];
	exercises: Exercise[];
	workoutExercise: WorkoutExercise = {
		id: null,
		exerciseId: null,
		exerciseNumber: null,
		sessionId: null,
		exercise: null,
		workoutSet: [],
		isWarmup: false
	};

	public unique_key: number;
	public parentRef: SessionComponent;

	workoutSetMap: Map<string, number> = new Map<string, number>();
	@ViewChild('viewWorkoutSetRef', {static: false, read: ViewContainerRef}) VCR: ViewContainerRef;

	child_unique_key: number = 0;
	componentsReferences = Array<ComponentRef<WorkoutSetComponent>>()

	constructor(
		private CFR: ComponentFactoryResolver,
		private workoutExerciseService: WorkoutExerciseService,
		private ref: ChangeDetectorRef
	) {
	}

	ngAfterViewInit(): void {
		this.workoutExercise.workoutSet.sort((ws1, ws2) => ws1.setNumber - ws2.setNumber).forEach(workoutSet => {
			this.initializeWorkoutSetComponent(workoutSet);
			this.ref.detectChanges();
		})
	}

	ngOnInit() {
		this.setExercises();
	}

	setExercises() {
		this.exerciseDictionary = this.exercises
			.sort((ex1, ex2) => ex1.name.localeCompare(ex2.name));
		this.ref.detectChanges();
	}

	removeWorkoutExercise() {
		this.workoutExerciseService.deleteWorkoutExercise(this.workoutExercise.id).subscribe(response => {
			let data = response;
			this.ref.detectChanges();
		})
		if (this.workoutExercise.isWarmup) {
			this.parentRef.removeWarmup(this.unique_key)
		} else {
			this.parentRef.remove(this.unique_key)
		}
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
			let id = (response as PostWorkoutExerciseResponse).postedWorkoutExerciseIds[0];
			this.workoutExercise.id = id;
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
