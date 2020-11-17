import {AfterViewInit, Component, ComponentFactoryResolver, ComponentRef, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {UserService} from '../../../../../../core/database/_services/user.service';
import {SessionService} from '../../../../../../core/database';
import {SessionComponent} from '../../../../../partials/content/database/session/session.component';
import {GraphQlResponse} from '../../../../../../core/database/_models/graphQlResponse';
import {Session} from '../../../../../../core/database/_models/session';

@Component({
	selector: 'kt-session-edit',
	templateUrl: './session-edit.component.html',
	providers: [UserService, SessionService],
	styleUrls: ['./session-edit.component.scss'],
})
export class SessionEditComponent implements OnInit, AfterViewInit, myinterface {

	selectedDate: Date = new Date();
	@ViewChild('viewSessionRef', {static: false, read: ViewContainerRef}) VCR: ViewContainerRef;
	child_unique_key: number = 0;
	componentsReferences = Array<ComponentRef<SessionComponent>>()

	constructor(
		private CFR: ComponentFactoryResolver,
		private sessionService: SessionService,
		private userService: UserService
	) {
	}


	ngOnInit() {
		// this.loadSessions(new Date());
	}

	ngAfterViewInit(): void {
		debugger;
		this.loadSessions(new Date())
	}

	dateChanged(date) {
		this.selectedDate = date;
		this.loadSessions(date);
	}

	loadSessions(date) {
		let formattedDate = this.formatDateToString(date);

		let sessions: Session[] = [];

		this.sessionService.getSessionsForDate(formattedDate)
			.subscribe(response => {
				if ((response as GraphQlResponse).data.sessions.length > 0) {
					sessions = (response as GraphQlResponse).data.sessions.map(s => ({
						id: s.id,
						location: s.location,
						programme: s.programme,
						splitName: s.splitName,
						localDateTime: s.localDateTime,
						userId: s.userId,
						workoutSet: s.workoutSet
					}));
					debugger;
					sessions.forEach(session => this.createComponent(session));
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

	createComponent(session: Session) {
		let componentFactory = this.CFR.resolveComponentFactory(SessionComponent);

		let childComponentRef = this.VCR.createComponent(componentFactory);

		let childComponent = childComponentRef.instance;
		childComponent.unique_key = ++this.child_unique_key;
		childComponent.parentRef = this;

		childComponent.session = session;

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

// Interface
export interface myinterface {
	remove(index: number);
}
