import { BaseModel } from '../../_base/crud';
import { Address } from './address.model';
import { SocialNetworks } from './social-networks.model';

export class User extends BaseModel {
    id: number;
    firstName: string;
    lastName: string;
    gender: string;
    birthday: string;
    refreshToken: Date;

    clear(): void {
        this.id = undefined;
        this.firstName = '';
        this.lastName = '';
        this.gender = '';
        this.birthday = undefined;
    }
}
