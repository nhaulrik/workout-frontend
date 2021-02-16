import {AfterViewInit, ChangeDetectorRef, Component, ComponentFactoryResolver, OnInit} from '@angular/core';
import {ProgrammeComponent} from '../programme/programme.component';
import {Phase} from '../../../../../../core/database/_models/programme/phase';
import {MatDialog} from '@angular/material';
import {DialogPhaseComponent} from '../dialog-phase/dialog-phase.component';

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
		public dialog: MatDialog,
	) {
	}

	ngOnInit() {
	}

	ngAfterViewInit(): void {
	}

	showPhaseDetails(phase: Phase) {
		const dialogRef = this.dialog.open(DialogPhaseComponent, {
			width: '800px',
			data: {phase}
		});

		dialogRef.afterClosed().subscribe(result => {
			this.ngOnInit();
		});
	}
}
