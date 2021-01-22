import {Component, OnInit} from '@angular/core';

@Component({
	selector: 'kt-programme',
	templateUrl: './programme.component.html',
	styleUrls: ['./programme.component.scss']
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


	constructor() {
	}

	ngOnInit() {
	}

}
