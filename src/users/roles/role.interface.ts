import {Access} from '../user.access';

export interface IRole {
    name: string,
    permissions: Array<Access>,
    is(role: IRole): void;
}