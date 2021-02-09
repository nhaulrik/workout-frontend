import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ProgrammeService} from '../../../../../core/database/_services/programme.service';
import {MatDialog} from '@angular/material';
import {DialogCreateProgrammeComponent} from '../../../../partials/content/database/programme/dialog-create-component/dialog-create-programme.component';
import {GraphQlResponse} from '../../../../../core/database/_models/graphQlResponse';
import {Programme} from '../../../../../core/database/_models/programme';

@Component({
	selector: 'kt-programme',
	templateUrl: './programme.component.html',
	styleUrls: ['./programme.component.scss'],
	providers: [ProgrammeService]
})
export class ProgrammeComponent implements OnInit {

	programmes: Programme[] = [];

	constructor(
		private programmeService: ProgrammeService,
		public dialog: MatDialog,
		public ref: ChangeDetectorRef
	) {
	}

	ngOnInit() {
		this.programmeService.getProgrammes().subscribe(response => {
			this.programmes = (response as GraphQlResponse).data.programmes;
			this.ref.detectChanges();
		})
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
