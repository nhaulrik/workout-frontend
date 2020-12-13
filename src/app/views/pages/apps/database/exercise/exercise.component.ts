import {Component, OnInit, ViewChild} from '@angular/core';
import {ExerciseService} from '../../../../../core/database/_services/exercise.service';
import {GraphQlResponse} from '../../../../../core/database/_models/graphQlResponse';
import {Muscle} from '../../../../../core/database';
import {MatSort, MatTableDataSource} from '@angular/material';
import {animate, state, style, transition, trigger} from '@angular/animations';

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
	dataSource;
	columnsToDisplay: string[] = ['name', 'bodyPart', 'compound'];
	expandedElement: Muscle | null;

	@ViewChild(MatSort, {static: true}) sort: MatSort;

	constructor(
		private exerciseService: ExerciseService,
	) {
	}

	ngOnInit() {
		this.exerciseService.getExercises().subscribe(response => {
			let data = (response as GraphQlResponse).data;
			this.dataSource = new MatTableDataSource(data.exercises);
			this.dataSource.sort = this.sort;
			debugger;
		})
	}

}

