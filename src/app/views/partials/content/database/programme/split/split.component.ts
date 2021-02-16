import {Component, OnInit} from '@angular/core';
import {DialogPhaseComponent} from '../dialog-phase/dialog-phase.component';
import {Split} from '../../../../../../core/database/_models/programme/split';
import {Exercise} from '../../../../../../core/database/_models/exercise';

@Component({
	selector: 'kt-split',
	templateUrl: './split.component.html',
	styleUrls: ['./split.component.scss']
})
export class SplitComponent implements OnInit {

	public unique_key: number;
	public parentRef: DialogPhaseComponent;

	split: Split = {
		number: null,
		dayOfWeek: null,
		id: null,
		name: null,
		phaseId: null,
		week: null
	};
	exerciseDictionary: Exercise[] = [];

	constructor() {
	}

	ngOnInit() {
	}

}
