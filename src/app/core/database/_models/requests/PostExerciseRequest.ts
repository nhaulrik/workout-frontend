export interface PostExerciseRequest {
	id: string;
	name: string;
	bodyPart: string;
	isCompound: boolean;
	muscleIds: string[];
}
