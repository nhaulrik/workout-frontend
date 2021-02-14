import {
	AfterViewInit,
	ChangeDetectorRef,
	Component,
	ComponentFactoryResolver,
	ComponentRef,
	OnInit,
	ViewChild,
	ViewContainerRef
} from '@angular/core';
import {ProgrammeService} from '../../../../../core/database/_services/programme.service';
import {MatDialog} from '@angular/material';
import {DialogCreateProgrammeComponent} from '../../../../partials/content/database/programme/dialog-create-component/dialog-create-programme.component';
import {GraphQlResponse} from '../../../../../core/database/_models/graphQlResponse';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {ProgrammeComponent} from '../../../../partials/content/database/programme/programme/programme.component';
import {Programme} from '../../../../../core/database/_models/programme/programme';

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

	programmeDataSource: Programme[] = [];
	displayedProgrammeColumns: string[] = ['name'];
	expandedProgramme: Programme | null;

	@ViewChild('programmeRef', {static: false, read: ViewContainerRef}) VCR: ViewContainerRef;
	child_unique_key: number = 0;
	programmeReferences = Array<ComponentRef<ProgrammeComponent>>()


	constructor(
		private CFR: ComponentFactoryResolver,
		private programmeService: ProgrammeService,
		public dialog: MatDialog,
		public ref: ChangeDetectorRef
	) {
	}

	ngAfterViewInit(): void {
		this.loadProgrammes();
	}

	ngOnInit() {
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

	private loadProgrammes() {

		this.programmeService.getProgrammes().subscribe(response => {
			(response as GraphQlResponse).data.programmes.forEach(programme => {
				this.createProgrammeComponent(programme);
				this.ref.detectChanges();
			});
		})
	}

	private createProgrammeComponent(programme: Programme) {
		let componentFactory = this.CFR.resolveComponentFactory(ProgrammeComponent);
		let childComponentRef = this.VCR.createComponent(componentFactory);

		let childComponent = childComponentRef.instance;
		childComponent.unique_key = ++this.child_unique_key;
		childComponent.parentRef = this;

		childComponent.programme = programme;

		// add reference for newly created component
		this.programmeReferences.push(childComponentRef);
	}
}
