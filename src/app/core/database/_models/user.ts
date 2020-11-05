import {BaseModel} from '../../_base/crud';

export class User extends BaseModel {

	id: number;
	firstName: string;
	lastName: string;
	birthday: Date;
	gender: string;

	clear(): void {
	this.id = undefined;
	this.firstName = '';
	this.lastName = '';
	this.gender = '';
	this.birthday = undefined;
}
}
