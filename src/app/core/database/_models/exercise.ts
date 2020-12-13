import {Muscle} from './muscle';

export class Exercise {
	id: string;
	name: string;
	bodyPart: string;
	isCompound: boolean;
	muscles: Muscle[] = [];
}
