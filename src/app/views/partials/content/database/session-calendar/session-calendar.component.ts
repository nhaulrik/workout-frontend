import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {SessionService} from '../../../../../core/database';
import {GraphQlResponse} from '../../../../../core/database/_models/graphQlResponse';
import {Session} from '../../../../../core/database/_models/session';
import {SessionEditComponent} from '../../../../pages/apps/database/session/session-edit/session-edit.component';

@Component({
	selector: 'kt-session-calendar',
	templateUrl: './session-calendar.component.html',
	styleUrls: ['./session-calendar.component.scss']
})
export class SessionCalendarComponent implements OnInit {

	selectedDate: Date = new Date();
	sessionDates: Date[] = [];
	currentMonth: string;

	public unique_key: number;
	public parentRef: SessionEditComponent;


	dayChanged(day) {
		this.selectedDate.setDate(day)
		this.parentRef.dateChanged(this.selectedDate);
	}

	constructor(
		private sessionService: SessionService,
		private ref: ChangeDetectorRef
	) {
	}

	ngOnInit() {
		this.getSessionsForMonth(this.selectedDate);
		this.currentMonth = this.selectedDate.toLocaleString('default', {month: 'long'});
	}

	getSessionsForMonth(date: Date) {
		this.sessionService.getSessionsForMonth(date)
			.subscribe(response => {
				let graphQlResponse = (response as GraphQlResponse);

				if (graphQlResponse.data.sessions != undefined) {
					this.sessionDates = graphQlResponse.data.sessions.map((session: Session) => session.localDateTime);
				}
				this.ref.detectChanges();
			});
	}

	daysInMonth(): number[] {
		//Month is 0 based so 1 is added
		let days = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth() + 1, 0).getDate();
		let dayArray = Array(days).fill(0).map((x, i) => i + 1); // [1,2,3,4]
		return dayArray;
	}

	getSessionClass(day: number): string {

		let isSelected: boolean = this.selectedDate.getDate() === day;
		let dayHasSession: boolean = this.sessionDates.filter(date => day === new Date(date).getDate()).length > 0;

		if (dayHasSession && isSelected) {
			return 'is-selected-with-session';
		} else if (dayHasSession) {
			return 'has-session';
		} else if (isSelected) {
			return 'is-selected';
		}
		return '';
	}

	changeMonth(amount: number) {
		let date = this.selectedDate;
		let newMonth = date.getMonth() + amount;
		if (newMonth < 0) {
			newMonth += 12;
			date.setFullYear(date.getFullYear() - 1);
		}
		date.setMonth(newMonth);
		this.ngOnInit();
		this.parentRef.dateChanged(date);
	}

	changeYear(amount: number) {
		let currentYear = this.selectedDate.getFullYear();
		this.selectedDate.setFullYear(currentYear + amount);
		this.ngOnInit();
		this.parentRef.dateChanged(this.selectedDate);
	}

	reload() {
		this.ngOnInit();
	}
}
