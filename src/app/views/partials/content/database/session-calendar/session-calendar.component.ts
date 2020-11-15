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

	dayChanged(day) {
		this.selectedDate.setDate(day)
		this.dateChanged.emit(this.selectedDate);
	}

	constructor(
		private sessionService: SessionService
	) {
	}

	sessionMap: Map<Date, boolean> = new Map<Date, boolean>();

	ngOnInit() {
		this.getSessionsForMonth(this.selectedDate.getMonth() + 1, this.selectedDate.getFullYear());
	}

	getSessionsForMonth(month: number, year: number) {
		this.sessionService.getSessionsForMonth(month, year)
			.subscribe(response => {
				let graphQlResponse = (response as GraphQlResponse);

				if (graphQlResponse.data.sessions != undefined) {
					graphQlResponse.data.sessions.forEach((session: Session) => {
						let date = new Date(session.localDateTime);
						this.sessionMap.set(date, true);
					});
				}
			});
	}

	daysInMonth(month: number, year: number): number[] {
		var days = new Date(year, month, 0).getDate();

		var dayArray = Array(days).fill(0).map((x, i) => i + 1); // [1,2,3,4]
		return dayArray;
	}

}
