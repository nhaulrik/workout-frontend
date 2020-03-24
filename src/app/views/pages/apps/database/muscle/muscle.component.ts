import {Component, OnInit} from '@angular/core';
import {MuscleService} from '../../../../../core/database/_services/muscle.service';
import {Muscle} from '../../../../../core/database/_models/muscle';
import {GraphQlResponse} from '../../../../../core/database/_models/graphQlResponse';

@Component({
	selector: 'kt-muscle',
	templateUrl: './muscle.component.html',
	providers: [MuscleService]
})

export class MuscleComponent implements OnInit {
	muscles: Muscle[];
	constructor(private muscleService: MuscleService) {
	}

	ngOnInit(): void {
		this.getMuscles();

	}

	getMuscles() {
		this.muscleService.getMuscles()
			.subscribe(response => (this.muscles = (response as GraphQlResponse).data.muscles));
	}

}
