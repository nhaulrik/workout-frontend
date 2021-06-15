import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'kt-session-menu',
  templateUrl: './session-menu.component.html',
  styleUrls: ['./session-menu.component.scss']
})
export class SessionMenuComponent implements OnInit {

	@Output() deleteSessionEvent = new EventEmitter<string>();
	@Output() duplicateSessionEvent = new EventEmitter<string>();

	constructor() { }

  ngOnInit() {
  }

	deleteSession(): void {
		this.deleteSessionEvent.emit('');
	}

	duplicateSession(): void {
		this.duplicateSessionEvent.emit('');
	}

}
