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
import {ProgrammeEditComponent} from '../../../../../pages/apps/database/programme/programme-edit.component';
import {PhaseComponent} from '../phase/phase.component';
import {Programme} from '../../../../../../core/database/_models/programme/programme';
import {Phase} from '../../../../../../core/database/_models/programme/phase';

@Component({
	selector: 'kt-programme',
	templateUrl: './programme.component.html',
	styleUrls: ['./programme.component.scss']
})
export class ProgrammeComponent implements OnInit, AfterViewInit {

	public unique_key: number;
	public parentRef: ProgrammeEditComponent;

	@ViewChild('phaseRef', {static: false, read: ViewContainerRef}) VCR: ViewContainerRef;
	child_unique_key: number = 0;
	phaseReferences = Array<ComponentRef<PhaseComponent>>()

	programme: Programme;


	constructor(
		private CFR: ComponentFactoryResolver,
		public ref: ChangeDetectorRef
	) {
	}

	ngOnInit() {
	}

	ngAfterViewInit(): void {

		this.programme.phases.push({name: 'test', number: 1,splits: [], description: 'someDesca asd asd as as', id: '1234'})
		this.programme.phases.push({name: 'test22222', number: 2, splits: [], description: 'dsfsfvsdfd asd asd as as', id: '432234323'})

		this.programme.phases.sort((phase1, phase2) => phase1.number.toString().localeCompare(phase2.number.toString())).forEach(phase => {
			this.createPhaseComponents(phase);
		});
	}

	private createPhaseComponents(phase: Phase) {
		let componentFactory = this.CFR.resolveComponentFactory(PhaseComponent);
		let childComponentRef = this.VCR.createComponent(componentFactory);

		let childComponent = childComponentRef.instance;
		childComponent.unique_key = ++this.child_unique_key;
		childComponent.parentRef = this;

		childComponent.phase = phase;

		// add reference for newly created component
		this.phaseReferences.push(childComponentRef);
	}
}
