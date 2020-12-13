import {Component, OnInit, ViewChild} from '@angular/core';
import {MuscleService} from '../../../../../core/database/_services/muscle.service';
import {GraphQlResponse} from '../../../../../core/database/_models/graphQlResponse';
import {MatSort} from '@angular/material';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {Muscle} from '../../../../../core/database';

@Component({
	selector: 'kt-muscle',
	templateUrl: './muscle.component.html',
	providers: [MuscleService]
})

export class MuscleComponent implements OnInit {
	dataSource;
	displayedColumns: string[] = ['name', 'bodyPart'];

	constructor(
		private muscleService: MuscleService
	) {
	}

	@ViewChild(MatSort, {static: true}) sort: MatSort;

	ngOnInit(): void {
		this.getMuscles();
	}

	getMuscles() {
		this.muscleService.getMuscles()
			.subscribe(response => {
				this.dataSource = (response as GraphQlResponse).data.muscles;
				this.dataSource.sort = this.sort;
			});
	}

	drop(event: CdkDragDrop<Muscle[]>) {
		debugger;
		moveItemInArray(this.dataSource, event.previousIndex, event.currentIndex);
		console.log(event.container.data);
	}

}
