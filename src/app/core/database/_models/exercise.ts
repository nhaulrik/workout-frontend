import {Muscle} from './muscle';

export class Exercise {
	id: string;
	name: string;
	bodyPart: string;
	isCompound: boolean;
	muscles: Muscle[] = [];

	clear() {
		this.id = null;
		this.name = null;
		this.bodyPart = null;
		this.isCompound = null;
		this.muscles = [];
	}
}
