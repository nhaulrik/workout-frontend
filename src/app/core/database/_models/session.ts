import {WorkoutSet} from './workoutSet';

export interface Session {
	localDateTime: string;
	location: string;
	programme: string;
	splitName: string;
	userId: string;
	exerciseMap: Map<number,  Map<number, WorkoutSet>>;
}
