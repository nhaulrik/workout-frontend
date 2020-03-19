// import {User} from '../user/model/user';

import {Muscle} from './muscle';

export interface GraphQlResponse {
  data: GraphQlData;
}

export interface GraphQlData {
  muscles: Muscle[];
  // users: User[];
}
