import {AfterViewInit, ChangeDetectorRef, Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {ProgrammeService} from '../../../../../core/database/_services/programme.service';
import {MatDialog} from '@angular/material';
import {DialogCreateProgrammeComponent} from '../../../../partials/content/database/programme/dialog-create-component/dialog-create-programme.component';
import {GraphQlResponse} from '../../../../../core/database/_models/graphQlResponse';
import {Programme} from '../../../../../core/database/_models/programme';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {PhaseComponent} from '../../../../partials/content/database/programme/phase/phase.component';

@Component({
	selector: 'kt-programme-edit',
	templateUrl: './programme-edit.component.html',
	styleUrls: ['./programme-edit.component.scss'],
	providers: [ProgrammeService],
	animations: [
		trigger('detailExpand', [
			state('collapsed', style({height: '0px', minHeight: '0'})),
			state('expanded', style({height: '*'})),
			transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
		]),
	],
})
export class ProgrammeEditComponent implements OnInit, AfterViewInit {

	programmes: Programme[] = [];
	programmeDataSource: Programme[] = [];
	displayedProgrammeColumns: string[] = ['name'];
	expandedProgramme: Programme | null;

	@ViewChild('phaseRef', {static: false, read: ViewContainerRef}) VCR: ViewContainerRef;
	child_unique_key: number = 0;

	constructor(
		private CFR: ComponentFactoryResolver,
		private programmeService: ProgrammeService,
		public dialog: MatDialog,
		public ref: ChangeDetectorRef
	) {
	}

	ngAfterViewInit(): void {
		this.loadPhases();
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


	getRowColor(programme: any) {
		if (programme === this.expandedProgramme) {
			return 'gainsboro';
		}
	}

	private loadPhases() {
		this.createPhaseComponent();
	}

	private createPhaseComponent() {
		let componentFactory = this.CFR.resolveComponentFactory(PhaseComponent);
		let childComponentRef = this.VCR.createComponent(componentFactory);

		let childComponent = childComponentRef.instance;
		childComponent.unique_key = ++this.child_unique_key;
		childComponent.parentRef = this;

		// childComponent.session = session;

		// add reference for newly created component
		// this.sessionReferences.push(childComponentRef);
	}
}
