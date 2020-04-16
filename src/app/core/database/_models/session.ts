import {WorkoutSet} from './workoutSet';

export interface Session {
	sessionId: number;
	userId: number;
	localDateTime: string;
	location: string;
	programme: string;
	splitName: string;
	exerciseMap: Map<number,  Map<number, WorkoutSet>>;
}
