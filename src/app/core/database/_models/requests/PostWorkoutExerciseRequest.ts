export interface PostWorkoutExerciseRequest {
	id: string;
	exerciseNumber: number;
	sessionId: string;
	exerciseId: string;
	isWarmup: boolean;
}
