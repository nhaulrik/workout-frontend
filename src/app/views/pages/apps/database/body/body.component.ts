import {Component, OnInit} from '@angular/core';

@Component({
	selector: 'kt-body',
	templateUrl: './body.component.html',
	styleUrls: ['./body.component.scss']
})
export class BodyComponent implements OnInit {

	constructor() {
	}

	ngOnInit() {
	}

	getColor() {
		if (true) {
			return '#b9bfd7'
		} else {
			return '#e0b5cc'
		}
	}
}
