import {Component, OnInit, ViewChild} from '@angular/core';
import {ExerciseService} from '../../../../../core/database/_services/exercise.service';
import {GraphQlResponse} from '../../../../../core/database/_models/graphQlResponse';
import {Muscle} from '../../../../../core/database';
import {MatSort, MatTableDataSource} from '@angular/material';

@Component({
	selector: 'kt-exercise',
	templateUrl: './exercise.component.html',
	styleUrls: ['./exercise.component.scss'],
	providers: [ExerciseService],
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

