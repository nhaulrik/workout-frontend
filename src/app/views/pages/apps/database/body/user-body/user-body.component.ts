import {Component, OnInit} from '@angular/core';
import {BodyComponent} from '../body.component';
import {User} from '../../../../../../core/database/_models/user';

@Component({
	selector: 'kt-user-body',
	templateUrl: './user-body.component.html',
	styleUrls: ['./user-body.component.scss']
})
export class UserBodyComponent implements OnInit {

	user: User;

	public unique_key: number;
	public parentRef: BodyComponent;

	constructor() {
	}

	ngOnInit() {
		debugger;
	}

}
