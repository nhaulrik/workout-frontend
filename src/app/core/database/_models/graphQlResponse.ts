// import {User} from '../user/model/user';

import {Muscle} from './muscle';
import {Exercise} from './exercise';
import {User} from '../../auth';
import {Session} from './session';
import {WorkoutSet} from './workoutSet';

export interface GraphQlResponse {
  data: GraphQlData;
}

export interface GraphQlData {
  muscles: Muscle[];
  exercises: Exercise[];
  users: User[];
  sessions: Session[];
  workoutSets: WorkoutSet[];
}
