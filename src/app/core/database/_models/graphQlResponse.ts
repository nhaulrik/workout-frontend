// import {User} from '../user/model/user';

import {Muscle} from './muscle';
import {Exercise} from './exercise';
import {User} from '../../auth';

export interface GraphQlResponse {
  data: GraphQlData;
}

export interface GraphQlData {
  muscles: Muscle[];
  exercises: Exercise[];
  users: User[];
}
