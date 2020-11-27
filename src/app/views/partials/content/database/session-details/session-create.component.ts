import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SessionService, UserService} from '../../../../../core/database';
import {User} from '../../../../../core/database/_models/user';
import {GraphQlResponse} from '../../../../../core/database/_models/graphQlResponse';

@Component({
	selector: 'kt-session-create',
	templateUrl: './session-create.component.html',
	styleUrls: ['./session-create.component.scss']
})
export class SessionCreateComponent implements OnInit {

	users: Map<User, boolean> = new Map<User, boolean>();

	@Input()
	selectedDate: Date;

	@Output() sessionsCreated = new EventEmitter();


	constructor(
		private userService: UserService,
		private sessionService: SessionService
	) {
	}

	ngOnInit() {
		this.loadUsers();
	}

	private loadUsers() {
		this.userService.getUsers().subscribe(response => {
			let data = (response as GraphQlResponse).data;
			if (data != null) {
				data.users.forEach(user => {
					this.users.set(user, false);
				});
			}
		});
	}

	selectUser(user: User) {
		let currentlySelected = this.users.get(user);
		this.users.set(user, !currentlySelected);
	}

	createSession() {
		let usersToAdd: string[] = [];
		this.users.forEach((value: boolean, key: User) => {
			if (value) {
				usersToAdd.push(key.id);
			}
		});
		if (usersToAdd.length > 0) {
			this.sessionService.createSessions(usersToAdd, this.selectedDate).subscribe(response => {
				let graphQlResponse = (response as GraphQlResponse);
				if (graphQlResponse.data != null) {
					this.sessionsCreated.emit();

					//window.location.reload();
				}
			})
		}
	}
}
