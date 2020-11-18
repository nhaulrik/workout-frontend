import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SessionService} from '../../../../../core/database';
import {GraphQlResponse} from '../../../../../core/database/_models/graphQlResponse';
import {Session} from '../../../../../core/database/_models/session';

@Component({
	selector: 'kt-session-calendar',
	templateUrl: './session-calendar.component.html',
	styleUrls: ['./session-calendar.component.scss']
})
export class SessionCalendarComponent implements OnInit {

	@Output() dateChanged = new EventEmitter();
	@Input() selectedDate: Date;
	@Input() sessionDates: Date[];

	dayChanged(day) {
		this.selectedDate.setDate(day)
		this.dateChanged.emit(this.selectedDate);
	}

	constructor(
		private sessionService: SessionService
	) {
	}

	ngOnInit() {
		this.getSessionsForMonth(this.selectedDate.getMonth() + 1, this.selectedDate.getFullYear());
	}

	getSessionsForMonth(month: number, year: number) {
		this.sessionService.getSessionsForMonth(month, year)
			.subscribe(response => {
				let graphQlResponse = (response as GraphQlResponse);

				if (graphQlResponse.data.sessions != undefined) {
					this.sessionDates = graphQlResponse.data.sessions.map((session: Session) => session.localDateTime);
				}
			});
	}

	daysInMonth(date: Date): number[] {
		let days = new Date(date.getFullYear(), date.getMonth(), 0).getDate();
		let dayArray = Array(days).fill(0).map((x, i) => i + 1); // [1,2,3,4]
		return dayArray;
	}

	getSessionClass(day: number): string {

		if (this.selectedDate.getDate() === day) {
			return 'is-selected';
		}

		// let dates: number[] = this.sessionDates.map(sessionDate => new Date(sessionDate).getDate());
		let dayHasSession: boolean = this.sessionDates.filter(date => day === new Date(date).getDate()).length > 0;
		return dayHasSession ? 'has-session' : 'no-session';
	}
}
