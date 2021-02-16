import {AfterViewInit, Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';

@Component({
	selector: 'kt-dialog-phase',
	templateUrl: './dialog-phase.component.html',
	styleUrls: ['./dialog-phase.component.scss']
})
export class DialogPhaseComponent implements AfterViewInit {

	constructor(
		public dialogRef: MatDialogRef<DialogPhaseComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		public snackBar: MatSnackBar,
	) {
	}

	ngAfterViewInit(): void {
	}

}
