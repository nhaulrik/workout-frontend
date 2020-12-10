export interface PostWorkoutSetRequest {
	id: string;
	workoutExerciseId: string;
	repetitions: number;
	repetitionMaximum: number;
	setNumber: number;
	weight: number;
	single: boolean;
}
