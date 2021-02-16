import {AfterViewInit, Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';
import {Phase} from '../../../../../../core/database/_models/programme/phase';

@Component({
	selector: 'kt-dialog-phase',
	templateUrl: './dialog-phase.component.html',
	styleUrls: ['./dialog-phase.component.scss']
})
export class DialogPhaseComponent implements AfterViewInit {

	phase: Phase = {
		name: null,
		description: null,
		number: null,
		splits: [],
		id: null
	};

	constructor(
		public dialogRef: MatDialogRef<DialogPhaseComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		public snackBar: MatSnackBar,
	) {
	}

	ngAfterViewInit(): void {
		this.phase = this.data.phase;
	}

}
