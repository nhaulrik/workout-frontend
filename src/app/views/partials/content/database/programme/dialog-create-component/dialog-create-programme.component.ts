import {AfterViewInit, Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';

@Component({
	selector: 'kt-dialog-create-programme',
	templateUrl: './dialog-create-programme.component.html',
	styleUrls: ['./dialog-create-programme.component.scss']
})
export class DialogCreateProgrammeComponent implements AfterViewInit {

	constructor(
		public dialogRef: MatDialogRef<DialogCreateProgrammeComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		public snackBar: MatSnackBar
	) {
	}

	ngAfterViewInit(): void {
	}


}
