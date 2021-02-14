import {AfterViewInit, ChangeDetectorRef, Component, ComponentFactoryResolver, OnInit} from '@angular/core';
import {ProgrammeComponent} from '../programme/programme.component';
import {Phase} from '../../../../../../core/database/_models/programme/phase';

@Component({
	selector: 'kt-phase',
	templateUrl: './phase.component.html',
	styleUrls: ['./phase.component.scss']
})
export class PhaseComponent implements OnInit, AfterViewInit {

	public unique_key: number;
	public parentRef: ProgrammeComponent;
	phase: Phase;

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
