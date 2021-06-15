// Angular
import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
// Lodash
import {shuffle} from 'lodash';
// Services
// Widgets model
import {LayoutConfigService, SparklineChartOptions} from '../../../core/_base/layout';
import {Widget4Data} from '../../partials/content/widgets/widget4/widget4.component';
import {IntelligenceService} from '../../../core/database/_services/intelligence.service';
import {GraphQlResponse} from '../../../core/database/_models/graphQlResponse';
import {SessionIntelligence} from '../../../core/database/_models/sessionIntelligence';
import {BodyDistribution, ExerciseAverages, ExerciseIntelligence} from '../../../core/database/_models/exerciseIntelligence';

@Component({
	selector: 'kt-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['dashboard.component.scss'],
	providers: [IntelligenceService]
})
export class DashboardComponent implements OnInit {
	chartOptions1: SparklineChartOptions;
	chartOptions2: SparklineChartOptions;
	chartOptions3: SparklineChartOptions;
	chartOptions4: SparklineChartOptions;
	widget4_1: Widget4Data;
	widget4_2: Widget4Data;
	widget4_3: Widget4Data;
	widget4_4: Widget4Data;

	@ViewChild('myChart', {static: true}) myChart: ElementRef;
	@ViewChild('exerciseSetChart', {static: true}) exerciseChart: ElementRef;
	@ViewChild('exerciseBodyChart', {static: true}) exerciseBodyChart: ElementRef;

	sessionsBack: number = 10;
	allSessionData: SessionIntelligence[] = [];
	exerciseData: ExerciseAverages[] = [];
	bodyDistributions: BodyDistribution[] = [];
	data: any;
	labels: any;

	constructor(
		private layoutConfigService: LayoutConfigService,
		private intelligenceService: IntelligenceService,
		private ref: ChangeDetectorRef,
	) {
	}

	ngOnInit(): void {

		let userId = '51a649d4-d693-4b69-b039-b5ed0f971ac7';
		this.loadExerciseIntelligence(userId);

		this.intelligenceService.getSessionIntelligence(userId, this.sessionsBack).subscribe(response => {
			let totalWeights = (response as GraphQlResponse).data.sessionIntelligence.map(sessionIntelligence => sessionIntelligence.totalWeight);

			this.allSessionData = (response as GraphQlResponse).data.sessionIntelligence;

			this.chartOptions1 = {
				data: totalWeights,
				color: this.layoutConfigService.getConfig('colors.state.danger'),
				border: 3
			};
			this.data = totalWeights;
			this.labels =

			this.ref.detectChanges();
			this.initChart();
		})
	}

	private loadExerciseIntelligence(userId: string) {
		let sessionsBack = 10;
		this.intelligenceService.getIntelligence(userId, sessionsBack, null, null, null).subscribe(response => {
			this.exerciseData = (response as GraphQlResponse).data.exerciseIntelligence.exerciseAverages;
			this.bodyDistributions = (response as GraphQlResponse).data.exerciseIntelligence.bodyDistributions;
			this.initExerciseChart();
			this.initBodyChart();
		})
	}

	private initChart() {
		const chart = new Chart(this.myChart.nativeElement, {
			type: 'line',
			data: {
				labels: this.allSessionData.map(data => data.date),
				datasets: [{
					label: 'Session Volume',
					data: this.data,
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
					borderWidth: 1
				}]
				,
				options: {
					scales: {
						yAxes: [{
							ticks: {
								// beginAtZero: true,
								label: 'kgggg'
							}
						}]
					}
				}
			}
		});
	}

	private initExerciseChart() {
		const chart = new Chart(this.exerciseChart.nativeElement, {
			type: 'bar',
			data: {
				labels: this.exerciseData.map(data => data.exerciseName),
				datasets: [{
					label: 'Exercise Set Distribution',
					data: this.exerciseData.map(data => data.setCount),
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
					borderWidth: 1
				}]
				,
				options: {
					scales: {
						yAxes: [{
							ticks: {
								// beginAtZero: true,
								label: 'kgggg'
							}
						}]
					}
				}
			}
		});
	}

	private initBodyChart() {
		const chart = new Chart(this.exerciseBodyChart.nativeElement, {
			type: 'pie',
			data: {
				labels: this.bodyDistributions.map(bodyDistributions => bodyDistributions.bodyPart),
				datasets: [{
					label: 'Exercise Body Distribution',
					data: this.bodyDistributions.map(bodyDistributions => bodyDistributions.percentage),
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
