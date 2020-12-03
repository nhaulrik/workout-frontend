import {WorkoutSet} from './workoutSet';
import {User} from './user';
import {WorkoutExercise} from './workoutExercise';

export class Session {
	id: string
	location: string;
	programme: string;
	splitName: string;
	localDateTime: Date;

	userId: string;
	users: User[];
	workoutSet: WorkoutSet[];
	workoutExercises: WorkoutExercise[];
}
