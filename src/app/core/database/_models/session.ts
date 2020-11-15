import {WorkoutSet} from './workoutSet';
import {User} from './user';

export class Session {
	id: string
	location: string;
	programme: string;
	splitName: string;
	localDateTime: Date;

	user: User;
	workoutSet: WorkoutSet[];
}
