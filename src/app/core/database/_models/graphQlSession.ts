import {WorkoutSet} from './workoutSet';

export interface GraphQlSession {
	id: number;
	userId: number;
	localDateTime: string;
	location: string;
	programme: string;
	splitName: string;
	workoutSet: WorkoutSet[];
}
