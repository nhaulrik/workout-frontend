// Angular
import {ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';

import {UserService} from '../../../../../core/database';
import {MatSort, MatTableDataSource} from '@angular/material';
import {GraphQlResponse} from '../../../../../core/database/_models/graphQlResponse';

@Component({
	selector: 'kt-users-list',
	templateUrl: './users-list.component.html',
	providers: [UserService],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersListComponent implements OnInit {

	dataSource;
	displayedColumns: string[] = ['id', 'firstName', 'lastName', 'gender', 'birthday'];

	constructor(
		private userService: UserService) {
	}

	@ViewChild(MatSort, {static: true}) sort: MatSort;

	ngOnInit() {
		this.getUsers();
	}


	getUsers() {
		this.userService.getUsers()
			.subscribe(response => {
				debugger;
				this.dataSource = new MatTableDataSource((response as GraphQlResponse).data.users);
				this.dataSource.sort = this.sort;
			})
	}


	/**
	 * Redirect to edit page
	 *
	 * @param id
	 */
	// editUser(id) {
	// 	this.router.navigate(['../users/edit', id], {relativeTo: this.activatedRoute});
	// }
}
