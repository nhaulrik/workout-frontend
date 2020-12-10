import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {SessionService, UserService} from '../../../../../core/database';
import {User} from '../../../../../core/database/_models/user';
import {GraphQlResponse} from '../../../../../core/database/_models/graphQlResponse';
import {SessionEditComponent} from '../../../../pages/apps/database/session/session-edit/session-edit.component';

@Component({
	selector: 'kt-session-create',
	templateUrl: './session-create.component.html',
	styleUrls: ['./session-create.component.scss']
})
export class SessionCreateComponent implements OnInit {

	users: Map<User, boolean> = new Map<User, boolean>();
	sessionUsers: string[] = [];

	public unique_key: number;
	public parentRef: SessionEditComponent;

	constructor(
		private userService: UserService,
		private sessionService: SessionService,
		private ref: ChangeDetectorRef
	) {
	}

	ngOnInit() {
		this.loadUsers();
	}

	resetSelection(): void {
		this.sessionUsers = [];
	}

	private loadUsers() {
		this.userService.getUsers().subscribe(response => {
			let data = (response as GraphQlResponse).data;
			if (data != null) {
				data.users.forEach(user => {
					//if (!currentSessionUsers.has(user.id)) {
					this.users.set(user, false);
					//}
				});
			}
			this.ref.detectChanges();
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
			this.sessionService.createSessions(usersToAdd, this.parentRef.selectedDate).subscribe(response => {
				if (response != null) {
					this.parentRef.loadSessions(this.parentRef.selectedDate);
				}
			})
		}
	}

	initializeUsers(users: string[]) {
		this.sessionUsers = users;
	}
}
