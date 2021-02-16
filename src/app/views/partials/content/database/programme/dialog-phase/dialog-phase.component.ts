import {
	AfterViewInit,
	ChangeDetectorRef,
	Component,
	ComponentFactoryResolver,
	ComponentRef,
	Inject,
	OnInit,
	ViewChild,
	ViewContainerRef
} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';
import {Phase} from '../../../../../../core/database/_models/programme/phase';
import {SplitComponent} from '../split/split.component';
import {Split} from '../../../../../../core/database/_models/programme/split';
import {Exercise} from '../../../../../../core/database/_models/exercise';
import {ExerciseService} from '../../../../../../core/database/_services/exercise.service';
import {GraphQlResponse} from '../../../../../../core/database/_models/graphQlResponse';

@Component({
	selector: 'kt-dialog-phase',
	templateUrl: './dialog-phase.component.html',
	styleUrls: ['./dialog-phase.component.scss'],
	providers: [ExerciseService]
})
export class DialogPhaseComponent implements OnInit, AfterViewInit {

	exercises: Exercise[] = [];

	phase: Phase = {
		name: null,
		description: null,
		number: null,
		splits: [],
		id: null
	};

	@ViewChild('splitRef', {static: false, read: ViewContainerRef}) VCR: ViewContainerRef;
	child_unique_key: number = 0;
	splitReferences = Array<ComponentRef<SplitComponent>>()

	constructor(
		private CFR: ComponentFactoryResolver,
		public ref: ChangeDetectorRef,
		public dialogRef: MatDialogRef<DialogPhaseComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		public snackBar: MatSnackBar,
		private exerciseService: ExerciseService,
	) {
	}

	ngOnInit(): void {
		this.phase = this.data.phase;
	}

	ngAfterViewInit(): void {
		this.exerciseService.getExercises().subscribe(response => {
			this.exercises = (response as GraphQlResponse).data.exercises.sort((ex1, ex2) => ex1.name.localeCompare(ex2.name));
			this.createSplitComponents(this.phase.splits);
		});
	}

	private createSplitComponents(splits: Split[]) {

		splits = [{
			week: 1,
			phaseId: this.phase.id,
			number: 1,
			name: 'leg day',
			id: 'asdasd',
			dayOfWeek: 'MONDAY'
		}]

		splits.forEach(split => {
			let componentFactory = this.CFR.resolveComponentFactory(SplitComponent);
			let childComponentRef = this.VCR.createComponent(componentFactory);

			let childComponent = childComponentRef.instance;
			childComponent.unique_key = ++this.child_unique_key;
			childComponent.parentRef = this;

			childComponent.split = split;
			childComponent.exerciseDictionary = this.exercises;

			// add reference for newly created component
			this.splitReferences.push(childComponentRef);
		})


	}

}
