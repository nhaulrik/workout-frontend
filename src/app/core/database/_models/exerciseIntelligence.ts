export class ExerciseIntelligence {

	userId: string;
	exerciseAverages: ExerciseAverages[] = [];
	bodyDistributions: BodyDistribution[] = [];

}
export class BodyDistribution {
	bodyPart: string;
	totalVolume: number;
	percentage: number;
}

export class ExerciseAverages {
	exerciseAverage: number;
	exerciseName: String;
	setCount: number;
	volume: number;
	repetitions: number;
}

