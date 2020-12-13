import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {ExerciseService} from '../../../../../core/database/_services/exercise.service';
import {GraphQlResponse} from '../../../../../core/database/_models/graphQlResponse';
import {Muscle, MuscleService} from '../../../../../core/database';
import {MatTable} from '@angular/material';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {Exercise} from '../../../../../core/database/_models/exercise';
import {PostExerciseResponse} from '../../../../../core/database/_models/responses/PostExerciseResponse';

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
	exerciseDataSource: Exercise[];
	displayedExerciseColumns: string[] = ['name', 'bodyPart', 'compound'];
	expandedExercise: Exercise | null;

	muscleDataSource: Muscle[];
	displayedMuscleColumns: string[] = ['name', 'bodyPart'];

	@ViewChild('muscleTable', {static: false}) muscleTable: MatTable<any>;
	@ViewChild('exerciseTable', {static: false}) exerciseTable: MatTable<any>;

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
			this.exerciseDataSource = data.exercises.map(exercise => <Exercise>{
					id: exercise.id,
					name: exercise.name,
					isCompound: exercise.isCompound,
					bodyPart: exercise.bodyPart,
					muscles: exercise.muscles != null ? exercise.muscles : []
				}
			);
			this.ref.detectChanges();
		});
	}

	drop(event: CdkDragDrop<Muscle[]>) {
		const prevIndex = this.muscleDataSource.findIndex((d) => d === event.item.data);
		moveItemInArray(this.muscleDataSource, prevIndex, event.currentIndex);
		this.muscleTable.renderRows();
	}

	dropExercise(event: CdkDragDrop<Exercise[]>) {
		const prevIndex = this.exerciseDataSource.findIndex((d) => d === event.item.data);
		moveItemInArray(this.exerciseDataSource, prevIndex, event.currentIndex);
		this.exerciseTable.renderRows();
	}

	dropMuscle($event: CdkDragDrop<Exercise[], any>, exercise: Exercise) {

		if ($event.previousContainer === $event.container) {
			//move inside (implement later)
		} else {
			//muscle has been dropped
			let muscle = this.muscleDataSource[$event.previousIndex];
			const hasMuscle: boolean = exercise.muscles.filter(m => m.id === muscle.id).length > 0

			if (hasMuscle) {
				return;
			} else {
				exercise.muscles.push(muscle);
				this.exerciseService.postExercise(exercise).subscribe(response => {
					let id = (response as PostExerciseResponse).postedExerciseIds[0];
				});
			}
		}
	}

}

