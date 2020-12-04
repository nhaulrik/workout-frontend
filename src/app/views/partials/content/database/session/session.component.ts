import {AfterViewInit, Component, ComponentFactoryResolver, ComponentRef, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {Session} from '../../../../../core/database/_models/session';
import {User} from '../../../../../core/database/_models/user';
import {WorkoutExerciseComponent} from '..';
import {SessionEditComponent} from '../../../../pages/apps/database/session/session-edit/session-edit.component';
import {SessionService} from '../../../../../core/database';
import {GraphQlResponse} from '../../../../../core/database/_models/graphQlResponse';
import {WorkoutExercise} from '../../../../../core/database/_models/workoutExercise';
import {MatSnackBar} from '@angular/material';

@Component({
	selector: 'kt-session',
	templateUrl: './session.component.html',
	styleUrls: ['./session.component.scss'],
})
export class SessionComponent implements OnInit, myinterface, AfterViewInit {
	session: Session;
	users: User[] = [];
	usersToAdd: string[] = [];

	public unique_key: number;
	public parentRef: SessionEditComponent;

	@ViewChild('viewWorkoutExerciseRef', {static: false, read: ViewContainerRef}) VCR: ViewContainerRef;
	child_unique_key: number = 0;

	componentsReferences = Array<ComponentRef<WorkoutExerciseComponent>>()

	constructor(
		public snackBar: MatSnackBar,
		private CFR: ComponentFactoryResolver,
		private sessionService: SessionService,
	) {
	}


	ngAfterViewInit(): void {
		this.session.workoutExercises.forEach(we => {
			this.initializeWorkoutExerciseComponent(we);
		});
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

		// add reference for newly created component
		this.componentsReferences.push(childComponentRef);
	}

	createWorkoutExerciseComponent() {
		let componentFactory = this.CFR.resolveComponentFactory(WorkoutExerciseComponent);

		let childComponentRef = this.VCR.createComponent(componentFactory);

		let childComponent = childComponentRef.instance;
		childComponent.unique_key = ++this.child_unique_key;
		childComponent.parentRef = this;
		childComponent.workoutExercise.sessionId = this.session.id;

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

	getUserName() {
		if (this.session.users != undefined && this.session.users.length > 0) {
			return this.session.users[0].firstName + ' ' + this.session.users[0].lastName;
		} else {
			return this.session.userId;
		}
	}


	getColor() {
		let gender: string = this.session.users[0].gender;
		if (gender == 'MALE') {
			return '#b9bfd7'
		} else if (gender == 'FEMALE') {
			return '#e0b5cc'
		} else {
			return 'white';
		}
	}

	updateSessionDetails() {
		this.sessionService.postSessionDetails(this.session).subscribe(response => {
			let data = (response as GraphQlResponse).data;

		});
	}

	deleteSession() {
		this.parentRef.removeSessionComponent(this.unique_key);
		this.sessionService.deleteSession(this.session.id).subscribe(response => {
			let sessionDeleted: boolean = (response as GraphQlResponse).data.deleteSession;
			if (sessionDeleted) {
				this.showSnackBar('Session was deleted');
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
}

// Interface
export interface myinterface {
	remove(index: number);
}
