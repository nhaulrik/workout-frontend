import {ExerciseForSession} from './exerciseForSession';

export interface Session {
	id: number;
	localDateTime: string;
	location: string;
	programme: string;
	splitName: string;
	userId: string;
	exercisesForSession: ExerciseForSession[];

	//workoutSet(key: string): WorkoutSet[];
}
