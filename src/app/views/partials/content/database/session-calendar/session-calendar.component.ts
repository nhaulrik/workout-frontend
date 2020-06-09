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

	@Output() selectedDateChange = new EventEmitter();
	@Input() selectedDate: number;

	change(day) {
		this.selectedDate = day;
		this.selectedDateChange.emit(day);
		debugger;
	}

	constructor(
		private sessionService: SessionService
	) {
	}

	sessionMap: Map<number, number> = new Map<number, number>();

	ngOnInit() {
		this.getSessionsForMonth(6, 2020);
	}

	getSessionsForMonth(month: number, year: number) {
		this.sessionMap = new Map<number, number>();
		this.sessionService.getSessionsForMonth(month, year)
			.subscribe(response => {
				var graphQlResponse = (response as GraphQlResponse);
				graphQlResponse.data.sessions.forEach((session: Session) => {
					var date = new Date(session.localDateTime);
					this.sessionMap.set(date.getDate(), session.id);
				});
			});
	}

	daysInMonth(month: number, year: number): number {
		var days = new Date(year, month, 0).getDate();

		var dayArray = Array(days).fill().map((x, i) => i); // [0,1,2,3,4]
		return dayArray;
	}

	updateCalendar() {
		this.getSessionsForMonth(6, 2020);
	}

	debugger() {
		var a = 123;
		debugger;

	}
}
