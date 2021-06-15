import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, ViewChild} from '@angular/core';
import {IntelligenceService} from '../../../../../core/database/_services/intelligence.service';
import {SessionService} from '../../../../../core/database';
import {GraphQlResponse} from '../../../../../core/database/_models/graphQlResponse';
import {ExerciseAverages, ExerciseIntelligence} from '../../../../../core/database/_models/exerciseIntelligence';

@Component({
	selector: 'kt-intelligence',
	templateUrl: './intelligence.component.html',
	styleUrls: ['./intelligence.component.scss'],
	providers: [IntelligenceService]
})
export class IntelligenceComponent implements AfterViewInit {

	@Input() selectedDate: Date;
	@Input() userId: string;
	@ViewChild('sessionChart', {static: true}) sessionChart: ElementRef;

	exerciseIdsMap: Map<string, string[]> = new Map<string, string[]>();
	userNameMap: Map<string, string> = new Map<string, string>();
	exerciseIntelligenceMap: Map<string, ExerciseIntelligence> = new Map<string, ExerciseIntelligence>();
	sessionsBack: number = 10;

	exerciseIntelligence: ExerciseAverages[];

	constructor(
		private ref: ChangeDetectorRef,
		private intelligenceService: IntelligenceService,
		private sessionService: SessionService,
	) {
	}

	clearData(): void {
		this.exerciseIdsMap = new Map<string, string[]>();
		this.userNameMap = new Map<string, string>();
		this.exerciseIntelligenceMap = new Map<string, ExerciseIntelligence>();
	}

	formatDateToShortString(dateObject: Date): string {

		if (dateObject != null) {

			const date = '{date}-{month}-{year}';
			const fullMonth = dateObject.getMonth() + 1 < 10 ? '0' + (dateObject.getMonth() + 1) : (dateObject.getMonth() + 1).toString();
			const fullDay = dateObject.getDate() < 10 ? '0' + dateObject.getDate().toString() : dateObject.getDate().toString();
			const formattedDate = date
				.replace('{date}', fullDay)
				.replace('{month}', fullMonth)
				.replace('{year}', dateObject.getFullYear().toString())

			return formattedDate;
		}
		return '';
	}

	initialize() {
		this.clearData();

		let dateString = this.formatDateToShortString(this.selectedDate);

		this.intelligenceService.getIntelligence(this.userId, 1, null, dateString, dateString).subscribe(response => {
			this.exerciseIntelligence = (response as GraphQlResponse).data.exerciseIntelligence.exerciseAverages;
			this.initSessionChart();
		});

		// this.sessionService.getSessionWithExerciseIdsAndUsers(this.selectedDate).subscribe(response => {
		// 	(response as GraphQlResponse).data.sessions.forEach(session => {
		// 		this.exerciseIdsMap.set(session.user[0].id, session.workoutExercises.map(we => we.exerciseId));
		// 		this.userNameMap.set(session.user[0].id, session.user[0].firstName + ' ' + session.user[0].lastName);
		// 		this.exerciseIdsMap.forEach((exerciseIds: string[], userId: string) => {
		// 			this.intelligenceService.getIntelligence(userId, this.sessionsBack, exerciseIds).subscribe(response => {
		// 				this.exerciseIntelligenceMap.set(this.userNameMap.get(userId), (response as GraphQlResponse).data.exerciseIntelligence);
		// 				this.ref.detectChanges();
		// 			});
		// 		});
		// 	})
		// })
	}

	ngAfterViewInit() {
		this.initialize();
	}

	private initSessionChart() {
		debugger;
		const chart = new Chart(this.sessionChart.nativeElement, {
			type: 'bar',
			options: {
				scales: {
					yAxes: [{
						ticks: {
							beginAtZero: true
						}
					}]
				}
			},
			data: {
				labels: this.exerciseIntelligence.map(exerciseIntelligence => exerciseIntelligence.exerciseName),
				datasets: [{
					label: 'Volume Distribution',
					data: this.exerciseIntelligence.map(exerciseIntelligence => exerciseIntelligence.volume),
					backgroundColor: [
						'rgba(255, 99, 132, 0.2)',
						'rgba(54, 162, 235, 0.2)',
						'rgba(255, 206, 86, 0.2)',
						'rgba(75, 192, 192, 0.2)',
						'rgba(153, 102, 255, 0.2)',
						'rgba(255, 159, 64, 0.2)'
					],
					borderColor: [
						'rgba(255, 99, 132, 1)',
						'rgba(54, 162, 235, 1)',
						'rgba(255, 206, 86, 1)',
						'rgba(75, 192, 192, 1)',
						'rgba(153, 102, 255, 1)',
						'rgba(255, 159, 64, 1)'
					],
					borderWidth: 2
				}]
			}
		});
	}
}
