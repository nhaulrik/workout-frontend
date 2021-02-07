import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ProgrammeService} from '../../../../../core/database/_services/programme.service';
import {DialogAdvancedMeasurementComponent} from '../../../../partials/content/database/body/user-body/dialog-advanced-measurement/dialog-advanced-measurement.component';
import {MatDialog} from '@angular/material';
import {DialogCreateProgrammeComponent} from './dialog/dialog-create-programme/dialog-create-programme.component';

@Component({
	selector: 'kt-programme',
	templateUrl: './programme.component.html',
	styleUrls: ['./programme.component.scss'],
	providers: [ProgrammeService]
})
export class ProgrammeComponent implements OnInit {

	programmes: any = [
		{
			name: 'Stronglifts 5x5',
		},
		{
			name: 'Max Muscle Plan',
		}
	];


	constructor(
		private programmeService: ProgrammeService,
		public dialog: MatDialog,
		public ref: ChangeDetectorRef
	) {
	}

	ngOnInit() {
		this.ref.detectChanges();
	}

	createProgramme() {
		const dialogRef = this.dialog.open(DialogCreateProgrammeComponent, {
			width: '400px',
			data: {}
		});

		dialogRef.afterClosed().subscribe(result => {
			this.ngOnInit();
		});
	}


}
