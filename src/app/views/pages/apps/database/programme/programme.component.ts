import {Component, OnInit} from '@angular/core';
import {ProgrammeService} from '../../../../../core/database/_services/programme.service';

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
		private programmeService: ProgrammeService
	) {
	}

	ngOnInit() {
	}

	createProgramme() {
		debugger;

		this.programmeService.postProgramme(null);
	}
}
