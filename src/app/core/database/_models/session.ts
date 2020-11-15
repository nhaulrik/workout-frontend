import {WorkoutSet} from './workoutSet';
import {User} from './user';

export class Session {
	id: string
	location: string;
	programme: string;
	splitName: string;
	localDateTime: Date;

	userId: string;
	workoutSet: WorkoutSet[];
}
