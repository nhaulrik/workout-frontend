import {Phase} from './phase';

export class Programme {
	id: string
	name: string
	date: Date
	description: string
	phases: Phase[] = [];
}
