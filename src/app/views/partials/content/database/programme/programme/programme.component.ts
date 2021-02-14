import {Component, OnInit} from '@angular/core';
import {ProgrammeEditComponent} from '../../../../../pages/apps/database/programme/programme-edit.component';
import {Programme} from '../../../../../../core/database/_models/programme';

@Component({
	selector: 'kt-programme',
	templateUrl: './programme.component.html',
	styleUrls: ['./programme.component.scss']
})
export class ProgrammeComponent implements OnInit {

	public unique_key: number;
	public parentRef: ProgrammeEditComponent;

	programme: Programme;


	constructor() {
	}

	ngOnInit() {
	}

}
