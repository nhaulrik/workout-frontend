import {Component, OnInit, ViewChild} from '@angular/core';
import {ExerciseService} from '../../../../../core/database/_services/exercise.service';
import {GraphQlResponse} from '../../../../../core/database/_models/graphQlResponse';
import {Muscle, MuscleService} from '../../../../../core/database';
import {MatSort, MatTableDataSource} from '@angular/material';
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

	muscleDataSource;
	displayedMuscleColumns: string[] = ['name', 'bodyPart'];
	expandedElement: Muscle | null;

	@ViewChild(MatSort, {static: true}) sort: MatSort;

	constructor(
		private exerciseService: ExerciseService,
		private muscleService: MuscleService
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
			});
	}

	private getExercises() {
		this.exerciseService.getExercises().subscribe(response => {
			let data = (response as GraphQlResponse).data;
			this.exerciseDataSource = new MatTableDataSource(data.exercises);
			this.exerciseDataSource.sort = this.sort;
			debugger;
		})
	}

	drop(event: CdkDragDrop<Muscle[]>) {
		debugger;
		moveItemInArray(this.muscleDataSource, event.previousIndex, event.currentIndex);
		console.log(event.container.data);
	}

}

