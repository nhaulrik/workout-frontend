import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {BodyComponent} from '../body.component';
import {User} from '../../../../../../core/database/_models/user';
import {BodyMeasurements} from '../../../../../../core/database/_models/bodyMeasurements';
import {BodyMeasurementService} from '../../../../../../core/database';
import {GraphQlResponse} from '../../../../../../core/database/_models/graphQlResponse';
import {MatDialog, MatSnackBar} from '@angular/material';
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
		date: null,
		dateString: null,
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
		public dialog: MatDialog,
		public snackBar: MatSnackBar
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

	openDialog(): void {
		const dialogRef = this.dialog.open(DialogAdvancedMeasurementComponent, {
			width: '400px',
			data: {user: this.user}
		});

		dialogRef.afterClosed().subscribe(result => {
			this.ngOnInit();
		});
	}

	submitBodyMeasurements() {
		this.bodyMeasurementService.postBodyMeasurements(this.postBodyMeasurements).subscribe(response => {
			this.showSnackBar('Body measurement was submitted');
			this.ngOnInit();
		})
	}

	showSnackBar(message: string) {
		this.snackBar.open(message, '', {
			duration: 3000
		});
	}

	dateChanged($event) {
		let date = $event.value;
		this.postBodyMeasurements.date = date;
	}

	formIsValid() {
		let hasDateAndUserId = this.postBodyMeasurements.userId != null && this.postBodyMeasurements.date != null;
		let hasValues =
			this.postBodyMeasurements.weight != null ||
			this.postBodyMeasurements.chest != null ||
			this.postBodyMeasurements.hip != null ||
			this.postBodyMeasurements.stomach != null ||
			this.postBodyMeasurements.singleThigh != null ||
			this.postBodyMeasurements.singleForearm != null ||
			this.postBodyMeasurements.singleBiceps != null ||
			this.postBodyMeasurements.singleCalve != null;

		return hasDateAndUserId && hasValues == true;
	}
}
