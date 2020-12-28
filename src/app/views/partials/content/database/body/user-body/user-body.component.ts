import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {BodyComponent} from '../body.component';
import {User} from '../../../../../../core/database/_models/user';
import {BodyMeasurements} from '../../../../../../core/database/_models/bodyMeasurements';
import {BodyMeasurementService} from '../../../../../../core/database';
import {GraphQlResponse} from '../../../../../../core/database/_models/graphQlResponse';
import {MatDialog} from '@angular/material';
import {DialogAdvancedMeasurementComponent} from './dialog-advanced-measurement/dialog-advanced-measurement.component';

@Component({
	selector: 'kt-user-body',
	templateUrl: './user-body.component.html',
	styleUrls: ['./user-body.component.scss'],
	providers: [BodyMeasurementService],
})
export class UserBodyComponent implements OnInit {

	user: User;

	bodyMeasurements: BodyMeasurements[] = [];
	displayedBodyMeasurementsColumns: string[] = ['date', 'weight', 'chest', 'hip', 'stomach', 'thigh', 'biceps', 'calves', 'forearm', 'submitInput'];
	inputEnabled: boolean = false;

	postBodyMeasurements: BodyMeasurements = {
		id: null,
		userId: null,
		createDate: null,
		weight: null,
		chest: null,
		hip: null,
		stomach: null,
		singleThigh: null,
		leftThigh: null,
		rightThigh: null,
		singleCalve: null,
		leftCalve: null,
		rightCalve: null,
		singleBiceps: null,
		leftBiceps: null,
		rightBiceps: null,
		singleForearm: null,
		leftForearm: null,
		rightForearm: null
	};

	public unique_key: number;
	public parentRef: BodyComponent;

	constructor(
		private bodyMeasurementService: BodyMeasurementService,
		private ref: ChangeDetectorRef,
		public dialog: MatDialog
	) {
	}

	ngOnInit() {
		this.postBodyMeasurements.userId = this.user.id;
		this.bodyMeasurementService.getBodyMeasurements(this.user.id).subscribe(response => {
			let data = (response as GraphQlResponse).data.bodyMeasurements;
			this.bodyMeasurements = data;
			this.ref.detectChanges();
		})
	}

	postMeasurements() {
		this.bodyMeasurementService.postBodyMeasurements(this.postBodyMeasurements).subscribe(response => {
			let bla = response;
		})
	}

	openDialog(): void {
		const dialogRef = this.dialog.open(DialogAdvancedMeasurementComponent, {
			width: '800px',
			data: {user: this.user}
		});

		dialogRef.afterClosed().subscribe(result => {
			console.log('The dialog was closed');
			// this.animal = result;
		});
	}
}
