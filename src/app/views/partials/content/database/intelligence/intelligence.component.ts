import {AfterViewInit, ChangeDetectorRef, Component, Input} from '@angular/core';
import {IntelligenceService} from '../../../../../core/database/_services/intelligence.service';
import {SessionService} from '../../../../../core/database';
import {GraphQlResponse} from '../../../../../core/database/_models/graphQlResponse';
import {ExerciseIntelligence} from '../../../../../core/database/_models/intelligence';

@Component({
	selector: 'kt-intelligence',
	templateUrl: './intelligence.component.html',
	styleUrls: ['./intelligence.component.scss'],
	providers: [IntelligenceService]
})
export class IntelligenceComponent implements AfterViewInit {

	@Input() selectedDate: Date;

	exerciseIdsMap: Map<string, string[]> = new Map<string, string[]>();
	userNameMap: Map<string, string> = new Map<string, string>();
	private exerciseIntelligenceList: ExerciseIntelligence[] = [];


	constructor(
		private ref: ChangeDetectorRef,
		private intelligenceService: IntelligenceService,
		private sessionService: SessionService,
	) {
	}

	clearData(): void {
		this.exerciseIdsMap = new Map<string, string[]>();
		this.userNameMap = new Map<string, string>();
		this.exerciseIntelligenceList = [];
	}

	initialize() {
		this.sessionService.getSessionWithExerciseIdsAndUsers(this.selectedDate).subscribe(response => {
			(response as GraphQlResponse).data.sessions.forEach(session => {
				this.clearData();

				this.exerciseIdsMap.set(session.user[0].id, session.workoutExercises.map(we => we.exerciseId));
				this.userNameMap.set(session.user[0].id, session.user[0].firstName + ' ' + session.user[0].lastName);
				this.exerciseIdsMap.forEach((exerciseIds: string[], userId: string) => {
					this.intelligenceService.getIntelligence(userId, exerciseIds).subscribe(response => {
						this.exerciseIntelligenceList.push((response as GraphQlResponse).data.exerciseIntelligence);
						this.ref.detectChanges();
					});
				});
			})
		})
	}

	ngAfterViewInit() {
		this.initialize();
	}

}
