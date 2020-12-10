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
import {UserService} from '../../../../../../core/database/_services/user.service';
import {SessionService} from '../../../../../../core/database';
import {SessionComponent} from '../../../../../partials/content/database/session/session.component';
import {GraphQlResponse} from '../../../../../../core/database/_models/graphQlResponse';
import {Session} from '../../../../../../core/database/_models/session';
import {SessionCalendarComponent, SessionCreateComponent} from '../../../../../partials/content/database';

@Component({
	selector: 'kt-session-edit',
	templateUrl: './session-edit.component.html',
	providers: [UserService, SessionService],
	styleUrls: ['./session-edit.component.scss'],
})
export class SessionEditComponent implements OnInit, AfterViewInit, myinterface {

	selectedDate: Date = new Date();
	@ViewChild('viewSessionRef', {static: false, read: ViewContainerRef}) VCR: ViewContainerRef;
	@ViewChild('sessionCalendarRef', {static: false, read: ViewContainerRef}) VCR2: ViewContainerRef;
	@ViewChild('sessionCreateRef', {static: false, read: ViewContainerRef}) VCR3: ViewContainerRef;

	child_unique_key: number = 0;
	sessionReferences = Array<ComponentRef<SessionComponent>>();
	private sessionCalendarComponent: SessionCalendarComponent;
	sessionCreateComponent: SessionCreateComponent;

	constructor(
		private CFR: ComponentFactoryResolver,
		private sessionService: SessionService,
		private userService: UserService,
		private ref: ChangeDetectorRef
	) {
	}

	ngOnInit() {
	}

	ngAfterViewInit(): void {
		this.createCalendarComponent();
		this.createSessionCreateComponent();
		this.loadSessions(new Date());
	}

	dateChanged(date) {
		this.clearSessions();
		this.selectedDate = date;
		this.loadSessions(date);
	}

	loadSessions(date) {
		let formattedDate = this.formatDateToString(date);

		let sessions: Session[] = [];
		this.sessionService.getSessionsForDate(formattedDate)
			.subscribe(response => {
				this.sessionCreateComponent.initializeUsers([]);
				if ((response as GraphQlResponse).data.sessions.length > 0) {
					sessions = (response as GraphQlResponse).data.sessions.map(s => ({
						id: s.id,
						location: s.location,
						programme: s.programme,
						splitName: s.splitName,
						localDateTime: s.localDateTime,
						userId: s.userId,
						users: s.users,
						workoutExercises: s.workoutExercises
					}));
					sessions.forEach(session => {
						if (!this.sessionExists(session.id)) {
							this.createSessionComponent(session);
						}
					});
					this.sessionCreateComponent.initializeUsers(sessions.map(session => session.userId));
					this.ref.detectChanges();
				} else {
					this.sessionReferences.forEach(sessionComponent => {
						let key: number = sessionComponent.instance.unique_key
						this.remove(key)
					})
				}
				this.ref.detectChanges();
			});
		this.sessionCalendarComponent.ngOnInit();
		this.ref.detectChanges();
	}

	sessionExists(sessionId: string): boolean {
		let sessionExists: boolean = this.sessionReferences.filter(sessionComponent => String(sessionComponent.instance.session.id) === String(sessionId)).length > 0;
		return sessionExists;
	}

	formatDateToString(dateObject) {

		if (dateObject != null && dateObject != '') {

			const date = '{date}-{month}-{year}';
			const fullMonth = dateObject.getMonth() + 1 < 10 ? '0' + (dateObject.getMonth() + 1) : dateObject.getMonth() + 1;
			const fullDay = dateObject.getDate() < 10 ? '0' + dateObject.getDate() : dateObject.getDate();
			const formattedDate = date
				.replace('{date}', fullDay)
				.replace('{month}', fullMonth)
				.replace('{year}', dateObject.getFullYear())

			return formattedDate;
		}
		return '';
	}

	createSessionComponent(session: Session) {
		let componentFactory = this.CFR.resolveComponentFactory(SessionComponent);

		let childComponentRef = this.VCR.createComponent(componentFactory);

		let childComponent = childComponentRef.instance;
		childComponent.unique_key = ++this.child_unique_key;
		childComponent.parentRef = this;

		childComponent.session = session;

		// add reference for newly created component
		this.sessionReferences.push(childComponentRef);
	}

	createCalendarComponent() {
		let componentFactory = this.CFR.resolveComponentFactory(SessionCalendarComponent);

		let childComponentRef = this.VCR2.createComponent(componentFactory);

		let childComponent = childComponentRef.instance;
		this.sessionCalendarComponent = childComponent;
		childComponent.unique_key = ++this.child_unique_key;
		childComponent.parentRef = this;
	}

	remove(key: number) {
		if (this.VCR.length < 1) return;

		let componentRef = this.sessionReferences.filter(
			x => x.instance.unique_key == key
		)[0];

		let vcrIndex: number = this.VCR.indexOf(componentRef as any);

		// removing component from container
		this.VCR.remove(vcrIndex);

		// removing component from the list
		this.sessionReferences = this.sessionReferences.filter(
			x => x.instance.unique_key !== key
		);
	}

	getTitle(): string {
		return 'Selected session date: ' + this.formatDateToString(this.selectedDate);
	}

	private clearSessions() {
		this.sessionReferences.forEach(sessionComponent => {
			let key: number = sessionComponent.instance.unique_key
			this.remove(key)
		})
	}

	removeSessionComponent(key: number) {
		if (this.VCR.length < 1) return;

		let componentRef = this.sessionReferences.filter(
			x => x.instance.unique_key == key
		)[0];

		let vcrIndex: number = this.VCR.indexOf(componentRef as any);

		// removing component from container
		this.VCR.remove(vcrIndex);

		// removing component from the list
		this.sessionReferences = this.sessionReferences.filter(
			x => x.instance.unique_key !== key
		);
		this.sessionCreateComponent.resetSelection();
		this.ref.detectChanges();
	}

	updateCalendar() {
		this.sessionCalendarComponent.reload();
	}

	private createSessionCreateComponent() {
		let componentFactory = this.CFR.resolveComponentFactory(SessionCreateComponent);

		let childComponentRef = this.VCR3.createComponent(componentFactory);

		let childComponent = childComponentRef.instance;
		this.sessionCreateComponent = childComponent;
		childComponent.unique_key = ++this.child_unique_key;
		childComponent.parentRef = this;
	}
}

// Interface
export interface myinterface {
	remove(index: number);
}
