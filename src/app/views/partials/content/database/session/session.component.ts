import {Component, ComponentFactoryResolver, ComponentRef, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {Session} from '../../../../../core/database/_models/session';
import {User} from '../../../../../core/database/_models/user';
import {WorkoutExerciseComponent} from '..';
import {SessionEditComponent} from '../../../../pages/apps/database/session/session-edit/session-edit.component';

@Component({
	selector: 'kt-session',
	templateUrl: './session.component.html',
	styleUrls: ['./session.component.scss']
})
export class SessionComponent implements OnInit, myinterface {
	session: Session;
	users: User[] = [];
	usersToAdd: string[] = [];

	public unique_key: number;
	public parentRef: SessionEditComponent;

	@ViewChild('viewWorkoutExerciseRef', {static: false, read: ViewContainerRef}) VCR: ViewContainerRef;
	child_unique_key: number = 0;

	componentsReferences = Array<ComponentRef<WorkoutExerciseComponent>>()

	constructor(
		private CFR: ComponentFactoryResolver
	) {
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

	createSession(): void {
		if (this.usersToAdd.length > 0) {
			// this.sessionService.createSessions(this.usersToAdd, this.selectedDate).subscribe(response => {
			// })
		}
	}

	createWorkoutExerciseComponent() {
		let componentFactory = this.CFR.resolveComponentFactory(WorkoutExerciseComponent);

		let childComponentRef = this.VCR.createComponent(componentFactory);

		let childComponent = childComponentRef.instance;
		childComponent.unique_key = ++this.child_unique_key;
		childComponent.parentRef = this;

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
			return '#7d8dc7'
		} else if (gender == 'FEMALE') {
			return '#d05898'
		} else {
			return 'white';
		}
	}
}

// Interface
export interface myinterface {
	remove(index: number);
}
