import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {ExerciseService} from '../../../../../core/database/_services/exercise.service';
import {GraphQlResponse} from '../../../../../core/database/_models/graphQlResponse';
import {Muscle, MuscleService} from '../../../../../core/database';
import {MatTable, MatTableDataSource} from '@angular/material';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
	selector: 'kt-exercise',
	templateUrl: './exercise.component.html',
	styleUrls: ['./exercise.component.scss'],
	providers: [ExerciseService],
	animations: [
		trigger('detailExpand', [
			state('collapsed', style({height: '0px', minHeight: '0'})),
			state('expanded', style({height: '*'})),
			transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
		]),
	],
})
export class ExerciseComponent implements OnInit {
	exerciseDataSource;
	displayedExerciseColumns: string[] = ['name', 'bodyPart', 'compound'];

	muscleDataSource: Muscle[];
	displayedMuscleColumns: string[] = ['name', 'bodyPart'];
	expandedElement: Muscle | null;

	@ViewChild('muscleTable', {static: false}) muscleTable: MatTable<any>;

	constructor(
		private exerciseService: ExerciseService,
		private muscleService: MuscleService,
		private ref: ChangeDetectorRef
	) {
	}

	ngOnInit() {
		this.getMuscles();
		this.getExercises();
	}

	private getMuscles() {
		this.muscleService.getMuscles()
			.subscribe(response => {
				this.muscleDataSource = (response as GraphQlResponse).data.muscles;
				this.ref.detectChanges();
			});
	}

	private getExercises() {
		this.exerciseService.getExercises().subscribe(response => {
			let data = (response as GraphQlResponse).data;
			this.exerciseDataSource = new MatTableDataSource(data.exercises);
			this.ref.detectChanges();
		})
	}

	drop(event: CdkDragDrop<Muscle[]>) {
		const prevIndex = this.muscleDataSource.findIndex((d) => d === event.item.data);
		moveItemInArray(this.muscleDataSource, prevIndex, event.currentIndex);
		this.muscleTable.renderRows();
	}

}

