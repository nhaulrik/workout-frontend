import {WorkoutSet} from './workoutSet';

export interface Session {
	id: number;
	userId: number;
	localDateTime: string;
	location: string;
	programme: string;
	splitName: string;
	exerciseMap: Map<number,  Map<number, WorkoutSet>>;
}
