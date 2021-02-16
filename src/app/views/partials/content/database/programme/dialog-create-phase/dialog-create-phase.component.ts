import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';
import {Programme} from '../../../../../../core/database/_models/programme/programme';
import {Phase} from '../../../../../../core/database/_models/programme/phase';
import {ProgrammeService} from '../../../../../../core/database/_services/programme.service';

@Component({
	selector: 'kt-dialog-create-phase',
	templateUrl: './dialog-create-phase.component.html',
	styleUrls: ['./dialog-create-phase.component.scss'],
	providers: [ProgrammeService]
})
export class DialogCreatePhaseComponent implements OnInit {

	programme: Programme;
	phase: Phase = {
		id: null,
		number: null,
		description: null,
		name: null,
		splits: null
	};

	constructor(
		private programmeService: ProgrammeService,
		public dialogRef: MatDialogRef<DialogCreatePhaseComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		public snackBar: MatSnackBar,
	) {
	}

	ngOnInit() {
		this.programme = this.data.programme;
	}

	formIsValid(): boolean {
		let hasValues =
			this.phase.number != null &&
			this.phase.name != null;

		return hasValues;
	}

	createPhase() {
		this.programme.phases.push(this.phase);
		this.programmeService.postPhase(this.programme.id, this.phase).subscribe(response => {
			this.dialogRef.close();
		})
	}

	onCancelClick() {
		this.dialogRef.close();
	}
}
