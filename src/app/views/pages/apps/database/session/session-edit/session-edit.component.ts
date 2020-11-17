import {Component, ComponentFactoryResolver, ComponentRef, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {UserService} from '../../../../../../core/database/_services/user.service';
import {GraphQlResponse} from '../../../../../../core/database/_models/graphQlResponse';
import {SessionService} from '../../../../../../core/database';
import {User} from '../../../../../../core/database/_models/user';
import {Session} from '../../../../../../core/database/_models/session';
import {WorkoutExerciseComponent} from '../../../../../partials/content/database';

@Component({
	selector: 'kt-session-edit',
	templateUrl: './session-edit.component.html',
	providers: [UserService, SessionService],
	styleUrls: ['./session-edit.component.scss'],
})
export class SessionEditComponent implements OnInit {

	selectedDate: Date = new Date();
	usersToAdd: string[] = [];

	users: User[] = [];
	sessions: Session[] = [];

	@ViewChild('viewWorkoutExerciseRef', {static: false, read: ViewContainerRef}) VCR: ViewContainerRef;
	child_unique_key: number = 0;
	componentsReferences = Array<ComponentRef<WorkoutExerciseComponent>>()

	constructor(
		private CFR: ComponentFactoryResolver,
		private sessionService: SessionService,
		private userService: UserService
	) {
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
			this.sessionService.createSessions(this.usersToAdd, this.selectedDate).subscribe(response => {
			})
		}
	}

	dateChanged(date) {
		this.selectedDate = date;
		this.getSession(date);
	}

	ngOnInit() {
		this.getUsers();
		this.getSession(new Date());
	}

	getSession(date) {
		var formattedDate = this.formatDateToString(date);

		this.sessionService.getSessionsForDate(formattedDate)
			.subscribe(response => {
				if ((response as GraphQlResponse).data.sessions.length > 0) {
					this.sessions = (response as GraphQlResponse).data.sessions.map(s => ({
						id: s.id,
						location: s.location,
						programme: s.programme,
						splitName: s.splitName,
						localDateTime: s.localDateTime,
						userId: s.userId,
						workoutSet: s.workoutSet
					}));
				}
			});
	}

	hasValue(str) {
		return !(!str || 0 === str.length);
	}

	formatDateToString(dateObject) {

		if (dateObject != null && dateObject != '') {

			const date = '{date}-{month}-{year}';
			const fullMonth = dateObject.getMonth() < 10 ? '0' + (dateObject.getMonth() + 1) : dateObject.getMonth() + 1;
			const fullDay = dateObject.getDate() < 10 ? '0' + dateObject.getDate() : dateObject.getDate();
			const formattedDate = date
				.replace('{date}', fullDay)
				.replace('{month}', fullMonth)
				.replace('{year}', dateObject.getFullYear())

			return formattedDate;
		}
		return '';
	}

	private getUsers() {
		this.userService.getUsers().subscribe(response => {
			if ((response as GraphQlResponse).data.users.length > 0) {
				this.users = (response as GraphQlResponse).data.users;
			}
		})
	}

	getUser(userId: string) {
		let user = this.users.filter(user => user.id == userId)[0];
		return user.firstName + ' ' + user.lastName;
	}


	createComponent() {
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
}
