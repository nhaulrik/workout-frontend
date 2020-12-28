import {AfterViewInit, Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {BodyMeasurements} from '../../../../../../../core/database/_models/bodyMeasurements';
import {BodyMeasurementService} from '../../../../../../../core/database';

@Component({
	selector: 'kt-dialog-advanced-measurement',
	templateUrl: './dialog-advanced-measurement.component.html',
	styleUrls: ['./dialog-advanced-measurement.component.scss'],
	providers: [BodyMeasurementService]
})
export class DialogAdvancedMeasurementComponent implements AfterViewInit {
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

	constructor(
		public dialogRef: MatDialogRef<DialogAdvancedMeasurementComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		bodyMeasurementService: BodyMeasurementService) {
	}

	onCancelClick(): void {
		this.dialogRef.close();
	}

	ngAfterViewInit(): void {
		this.postBodyMeasurements.userId = this.data.user.id;
	}

}
