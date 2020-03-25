import {Component, OnInit, ViewChild} from '@angular/core';
import {MuscleService} from '../../../../../core/database/_services/muscle.service';
import {GraphQlResponse} from '../../../../../core/database/_models/graphQlResponse';
import {MatSort, MatTableDataSource} from '@angular/material';

@Component({
	selector: 'kt-muscle',
	templateUrl: './muscle.component.html',
	providers: [MuscleService]
})

export class MuscleComponent implements OnInit {
	dataSource;
	displayedColumns: string[] = ['id', 'name', 'bodyPart'];

	constructor(private muscleService: MuscleService) {
	}

	@ViewChild(MatSort, {static: true}) sort: MatSort;

	ngOnInit(): void {
		this.getMuscles();
	}

	getMuscles() {
		this.muscleService.getMuscles()
			.subscribe(response => {
				this.dataSource = new MatTableDataSource((response as GraphQlResponse).data.muscles);
				this.dataSource.sort = this.sort;
			});
	}

}
