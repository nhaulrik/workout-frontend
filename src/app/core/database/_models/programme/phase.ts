import {Split} from './split';

export class Phase {
	id: string
	number: number
	name: string
	description: string
	splits: Split[] = new Array();
}
