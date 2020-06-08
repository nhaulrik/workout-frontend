import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UserService} from '../../../../../core/database';
import {User} from '../../../../../core/auth';
import {GraphQlResponse} from '../../../../../core/database/_models/graphQlResponse';

@Component({
	selector: 'kt-user-selector',
	templateUrl: './user-selector.component.html',
	styleUrls: ['./user-selector.component.scss'],
	providers: [UserService]
})
export class UserSelectorComponent implements OnInit {
	users: User[] = [];

	@Input() selectedUserId: number;
	@Output() selectedUserIdChange = new EventEmitter();

	change(newUserId) {
		this.selectedUserId = newUserId;
		this.selectedUserIdChange.emit(newUserId);
	}

	constructor(private userService: UserService) {
	}

	ngOnInit() {
		this.getUsers();
	}

	getUsers() {
		this.userService.getUsers()
			.subscribe(response => {
				this.users = (response as GraphQlResponse).data.users;
			});
	}

}
