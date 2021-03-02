// import {User} from '../user/model/user';

import {Muscle} from './muscle';
import {Exercise} from './exercise';
import {WorkoutSet} from './workoutSet';
import {Session} from './session';
import {User} from './user';
import {BodyMeasurements} from './bodyMeasurements';
import {Programme} from './programme/programme';
import {SessionIntelligence} from './sessionIntelligence';
import {ExerciseIntelligence} from './exerciseIntelligence';

export class GraphQlResponse {
	data: GraphQlData;
}

export class GraphQlData {
	muscles: Muscle[] = [];
	exercises: Exercise[] = [];
	users: User[] = [];
	sessions: Session[] = [];
	workoutSets: WorkoutSet[] = [];
	addWorkoutSet: string;
	bodyMeasurements: BodyMeasurements[] = [];
	exerciseIntelligence: ExerciseIntelligence;
	sessionIntelligence: SessionIntelligence[];
	programmes: Programme[] = [];

	[key: string]: any;
}
