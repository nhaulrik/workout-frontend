import {WorkoutSet} from './workoutSet';
import {Exercise} from './exercise';

export class WorkoutExercise {
	id: string;
	sessionId: string;
	exerciseId: string;
	exerciseNumber: number;
	workoutSet: WorkoutSet[];
	exercise: Exercise;
	isWarmup: boolean;
}
