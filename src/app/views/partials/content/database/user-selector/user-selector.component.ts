import {Component, OnInit} from '@angular/core';
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
