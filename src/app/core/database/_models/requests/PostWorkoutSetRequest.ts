export interface PostWorkoutSetRequest {
	id: string;
	userId: string;
	sessionId: string;
	workoutExerciseId: string;
	repetitions: number;
	repetitionMaximum: number;
	setNumber: number;
	weight: number;
	single: boolean;
}
