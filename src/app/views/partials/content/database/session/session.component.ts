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
import {Session} from '../../../../../core/database/_models/session';
import {User} from '../../../../../core/database/_models/user';
import {WorkoutExerciseComponent} from '..';
import {SessionEditComponent} from '../../../../pages/apps/database/session/session-edit/session-edit.component';
import {SessionService} from '../../../../../core/database';
import {GraphQlResponse} from '../../../../../core/database/_models/graphQlResponse';
import {WorkoutExercise} from '../../../../../core/database/_models/workoutExercise';
import {MatSnackBar} from '@angular/material';
import {ExerciseService} from '../../../../../core/database/_services/exercise.service';
import {Exercise} from '../../../../../core/database/_models/exercise';
import {PostSessionResponse} from '../../../../../core/database/_models/responses/PostSessionResponse';

@Component({
	selector: 'kt-session',
	templateUrl: './session.component.html',
	styleUrls: ['./session.component.scss'],
	providers: [ExerciseService]
})
export class SessionComponent implements OnInit, myinterface, AfterViewInit {
	session: Session;
	users: User[] = [];
	exercises: Exercise[] = [];
	usersToAdd: string[] = [];
	sessionLock: string = 'Lock';

	public unique_key: number;
	public parentRef: SessionEditComponent;

	@ViewChild('viewWorkoutExerciseRef', {static: false, read: ViewContainerRef}) VCR: ViewContainerRef;
	@ViewChild('viewWarmupExerciseRef', {static: false, read: ViewContainerRef}) VCR2: ViewContainerRef;
	child_unique_key: number = 0;

	componentsReferences = Array<ComponentRef<WorkoutExerciseComponent>>()
	warmupComponentsReferences = Array<ComponentRef<WorkoutExerciseComponent>>()

	constructor(
		public snackBar: MatSnackBar,
		private CFR: ComponentFactoryResolver,
		private sessionService: SessionService,
		private exerciseService: ExerciseService,
		private ref: ChangeDetectorRef
	) {
	}

	ngAfterViewInit(): void {
		this.exerciseService.getExercises().subscribe(response => {
			this.exercises = (response as GraphQlResponse).data.exercises;
			this.session.workoutExercises.sort((we1, we2) => we1.exerciseNumber - we2.exerciseNumber).forEach(we => {
				if (we.isWarmup) {
					this.createWarmupExerciseComponent(we);
				} else {
					this.initializeWorkoutExerciseComponent(we);
				}
			});
			this.ref.detectChanges();
		})
	}

	ngOnInit() {

	}

	addUser(userId: string, event: any) {
		if (event.checked) {
			if (!this.usersToAdd.includes(userId)) {
				this.usersToAdd.push(userId);
			}
		} else {
			this.usersToAdd = this.usersToAdd.filter(u => u !== userId);
		}
	}

	initializeWorkoutExerciseComponent(workoutExercise: WorkoutExercise) {
		let componentFactory = this.CFR.resolveComponentFactory(WorkoutExerciseComponent);

		let childComponentRef = this.VCR.createComponent(componentFactory);

		let childComponent = childComponentRef.instance;
		childComponent.unique_key = ++this.child_unique_key;
		childComponent.parentRef = this;
		childComponent.workoutExercise.sessionId = this.session.id;
		childComponent.workoutExercise = workoutExercise;
		childComponent.exercises = this.exercises;
		// add reference for newly created component
		this.componentsReferences.push(childComponentRef);
	}

	createWorkoutExerciseComponent(workoutExercise: WorkoutExercise) {
		let componentFactory = this.CFR.resolveComponentFactory(WorkoutExerciseComponent);

		let childComponentRef = this.VCR.createComponent(componentFactory);

		let childComponent = childComponentRef.instance;
		childComponent.unique_key = ++this.child_unique_key;
		childComponent.parentRef = this;
		childComponent.workoutExercise.sessionId = this.session.id;
		childComponent.workoutExercise.isWarmup = false;
		childComponent.workoutExercise.exerciseNumber = this.componentsReferences.length + 1;
		childComponent.exercises = this.exercises;
		if (workoutExercise != null) {
			childComponent.workoutExercise = workoutExercise;
		}
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

	removeWarmup(key: number) {
		if (this.VCR2.length < 1) return;

		let componentRef = this.warmupComponentsReferences.filter(
			x => x.instance.unique_key == key
		)[0];

		let vcrIndex: number = this.VCR2.indexOf(componentRef as any);

		// removing component from container
		this.VCR2.remove(vcrIndex);

		// removing component from the list
		this.warmupComponentsReferences = this.warmupComponentsReferences.filter(
			x => x.instance.unique_key !== key
		);
	}


	getUserName() {
		if (this.session.user != undefined) {
			return this.session.user.firstName + ' ' + this.session.user.lastName;
		} else {
			return this.session.userId;
		}
	}


	getColor() {
		let gender: string = this.session.user.firstName;
		if (gender == 'Nikolaj') {
			return '#b9bfd7'
		} else if (gender == 'Rikke') {
			return '#e0b5cc'
		} else if (gender == 'Klaus') {
			return '#c5e0b5'
		} else {
			return 'white';
		}
	}

	updateSessionDetails() {
		this.sessionService.postSession(this.session).subscribe(response => {
			const sessionId = (response as PostSessionResponse).postedSessionIds[0];
			this.session.id = sessionId;
		});
	}

	deleteSession() {
		if (this.sessionLock == 'Lock') {
			this.showSnackBar('cannot remove locked session');
			return;
		}

		this.parentRef.removeSessionComponent(this.unique_key);
		this.sessionService.deleteSession(this.session.id).subscribe(response => {
			if (response) {
				this.showSnackBar('Session was deleted');
				this.parentRef.updateCalendar();
			} else {
				this.showSnackBar('Something went wrong');
			}
		});
	}

	showSnackBar(message: string) {
		this.snackBar.open(message, '', {
			duration: 3000
		});
	}

	toggleEdit() {
		if (this.sessionLock == 'Lock') {
			this.sessionLock = 'Unlock';
		} else {
			this.sessionLock = 'Lock';
		}
	}

	createWarmupExerciseComponent(workoutExercise: WorkoutExercise) {
		let componentFactory = this.CFR.resolveComponentFactory(WorkoutExerciseComponent);

		let childComponentRef = this.VCR2.createComponent(componentFactory);

		let childComponent = childComponentRef.instance;
		childComponent.unique_key = ++this.child_unique_key;
		childComponent.parentRef = this;
		childComponent.workoutExercise.sessionId = this.session.id;
		childComponent.workoutExercise.isWarmup = true;
		childComponent.workoutExercise.exerciseNumber = this.warmupComponentsReferences.length + 1;
		if (workoutExercise != null) {
			childComponent.workoutExercise = workoutExercise;
		}
		childComponent.exercises = this.exercises;

		// add reference for newly created component
		this.warmupComponentsReferences.push(childComponentRef);
	}

}

// Interface
export interface myinterface {
	remove(index: number);
}
