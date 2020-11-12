import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UserService} from '../../../../../core/database';
import {GraphQlResponse} from '../../../../../core/database/_models/graphQlResponse';
import {User} from '../../../../../core/database/_models/user';

@Component({
	selector: 'kt-user-selector',
	templateUrl: './user-selector.component.html',
	styleUrls: ['./user-selector.component.scss'],
	providers: [UserService]
})
export class UserSelectorComponent implements OnInit {
	users: User[] = [];

	@Input() disabled: boolean;
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
