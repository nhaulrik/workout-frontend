import {Component, OnInit} from '@angular/core';
import {BodyComponent} from '../body.component';
import {User} from '../../../../../../core/database/_models/user';
import {BodyMeasurements} from '../../../../../../core/database/_models/bodyMeasurements';
import {BodyMeasurementService} from '../../../../../../core/database';
import {GraphQlResponse} from '../../../../../../core/database/_models/graphQlResponse';

@Component({
	selector: 'kt-user-body',
	templateUrl: './user-body.component.html',
	styleUrls: ['./user-body.component.scss'],
	providers: [BodyMeasurementService],
})
export class UserBodyComponent implements OnInit {

	user: User;

	bodyMeasurements: BodyMeasurements[] = [];
	displayedBodyMeasurementsColumns: string[] = ['date', 'weight', 'chest', 'hip', 'stomach', 'submitInput'];

	postBodyMeasurements: BodyMeasurements = {
		id: null,
		userId: null,
		createDate: null,
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
		private bodyMeasurementService: BodyMeasurementService
	) {
	}

	ngOnInit() {
		this.postBodyMeasurements.userId = this.user.id;
		this.bodyMeasurementService.getBodyMeasurements(this.user.id).subscribe(response => {
			let data = (response as GraphQlResponse).data.bodyMeasurements;
			this.bodyMeasurements = data;
		})
	}

	postMeasurements() {
		this.bodyMeasurementService.postBodyMeasurements(this.postBodyMeasurements).subscribe(response => {
			let bla = response;
		})
	}
}
