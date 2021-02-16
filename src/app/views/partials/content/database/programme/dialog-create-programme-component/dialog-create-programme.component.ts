import {AfterViewInit, Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';
import {ProgrammeService} from '../../../../../../core/database/_services/programme.service';
import {Programme} from '../../../../../../core/database/_models/programme/programme';

@Component({
	selector: 'kt-dialog-create-programme',
	templateUrl: './dialog-create-programme.component.html',
	styleUrls: ['./dialog-create-programme.component.scss'],
	providers: [ProgrammeService]
})
export class DialogCreateProgrammeComponent implements AfterViewInit {

	programme: Programme = {
		id: null,
		name: null,
		description: null,
		date: new Date(),
		phases: []
	}

	constructor(
		public dialogRef: MatDialogRef<DialogCreateProgrammeComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		public snackBar: MatSnackBar,
		private programmeService: ProgrammeService
	) {
	}

	ngAfterViewInit(): void {
	}


	formIsValid() {
		return this.programme.name != null && this.programme.name.length > 0;
	}

	createProgramme() {
		this.programmeService.postProgramme(this.programme).subscribe(response => {
			this.programmeService.getProgrammes().subscribe(response => {
				this.dialogRef.close();
			});
		})
	}

	onCancelClick() {
		this.dialogRef.close();
	}
}
