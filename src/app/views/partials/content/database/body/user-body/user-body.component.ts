import {Component, OnInit} from '@angular/core';
import {BodyComponent} from '../body.component';
import {User} from '../../../../../../core/database/_models/user';
import {BodyMeasurements} from '../../../../../../core/database/_models/bodyMeasurements';
import {UserService} from '../../../../../../core/database';

@Component({
	selector: 'kt-user-body',
	templateUrl: './user-body.component.html',
	styleUrls: ['./user-body.component.scss']
})
export class UserBodyComponent implements OnInit {

	user: User;
	bodyMeasurements: BodyMeasurements = {
		id: null,
		userId: null,

		weight: null,
		chest: null,
		hip: null,
		stomach: null,
		leftThigh: null,
		rightThigh: null,
		leftCalve: null,
		rightCalve: null,
		leftBiceps: null,
		rightBiceps: null,
		leftForearm: null,
		rightForearm: null
	};

	public unique_key: number;
	public parentRef: BodyComponent;

	constructor(
		private userService: UserService
	) {
	}

	ngOnInit() {
		this.bodyMeasurements.userId = this.user.id;
	}

	postMeasurements() {
		this.userService.postBodyMeasurements(this.bodyMeasurements).subscribe(response => {
			let bla = response;
		})
	}
}
