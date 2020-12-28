import {AfterViewInit, Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';
import {BodyMeasurements} from '../../../../../../../core/database/_models/bodyMeasurements';
import {BodyMeasurementService} from '../../../../../../../core/database';
import {User} from '../../../../../../../core/database/_models/user';

@Component({
	selector: 'kt-dialog-advanced-measurement',
	templateUrl: './dialog-advanced-measurement.component.html',
	styleUrls: ['./dialog-advanced-measurement.component.scss'],
	providers: [BodyMeasurementService]
})
export class DialogAdvancedMeasurementComponent implements AfterViewInit {

	user: User = {
		id: null,
		firstName: '',
		lastName: '',
		gender: '',
		birthday: null
	};

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

	constructor(
		public dialogRef: MatDialogRef<DialogAdvancedMeasurementComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		public bodyMeasurementService: BodyMeasurementService,
		public snackBar: MatSnackBar
	) {
	}

	onCancelClick(): void {
		this.dialogRef.close();
	}

	ngAfterViewInit(): void {
		this.postBodyMeasurements.userId = this.data.user.id;
		this.user = this.data.user;
	}

	formIsValid(): boolean {
		let hasValues =
			this.postBodyMeasurements.weight != null ||
			this.postBodyMeasurements.chest != null ||
			this.postBodyMeasurements.hip != null ||
			this.postBodyMeasurements.stomach != null ||
			this.postBodyMeasurements.leftThigh != null ||
			this.postBodyMeasurements.rightThigh != null ||
			this.postBodyMeasurements.leftForearm != null ||
			this.postBodyMeasurements.rightForearm != null ||
			this.postBodyMeasurements.leftBiceps != null ||
			this.postBodyMeasurements.rightBiceps != null ||
			this.postBodyMeasurements.leftCalve != null ||
			this.postBodyMeasurements.rightCalve != null;

		let hasDateAndUserId =
			this.postBodyMeasurements.date != null &&
			this.postBodyMeasurements.userId != null;

		return hasDateAndUserId && hasValues == true;
	}

	dateChanged($event) {
		let date = $event.value;
		this.postBodyMeasurements.date = date;
	}

	submitBodyMeasurements() {
		this.bodyMeasurementService.postBodyMeasurements(this.postBodyMeasurements).subscribe(response => {

			this.showSnackBar("Body measurement was submitted")
			this.dialogRef.close();
		})
	}

	showSnackBar(message: string) {
		this.snackBar.open(message, '', {
			duration: 3000
		});
	}
}
