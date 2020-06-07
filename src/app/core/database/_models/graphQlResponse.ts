// import {User} from '../user/model/user';

import {Muscle} from './muscle';
import {Exercise} from './exercise';
import {User} from '../../auth';
import {WorkoutSet} from './workoutSet';
import {GraphQlSession} from './graphQlSession';

export interface GraphQlResponse {
	data: GraphQlData;
}

export interface GraphQlData {
	muscles: Muscle[];
	exercises: Exercise[];
	users: User[];
	sessions: GraphQlSession[];
	workoutSet: WorkoutSet[];
	addSession: number;
}
