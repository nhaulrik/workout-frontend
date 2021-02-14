import {AfterViewInit, ChangeDetectorRef, Component, ComponentFactoryResolver, OnInit} from '@angular/core';
import {ProgrammeEditComponent} from '../../../../../pages/apps/database/programme/programme-edit.component';

@Component({
	selector: 'kt-phase',
	templateUrl: './phase.component.html',
	styleUrls: ['./phase.component.scss']
})
export class PhaseComponent implements OnInit, AfterViewInit {

	public unique_key: number;
	public parentRef: ProgrammeEditComponent;

	constructor(
		private ref: ChangeDetectorRef,
		private CFR: ComponentFactoryResolver,
	) {
	}

	ngOnInit() {
	}

	ngAfterViewInit(): void {
	}

}
