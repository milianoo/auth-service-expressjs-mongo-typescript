import {Access} from '../user.access';
import {IRole} from './role.interface';
import * as _ from 'lodash';

export class Role implements IRole{

    readonly permissions: Array<Access>;

    constructor(
        public name: string
    ) {
        this.permissions = [];
    }

    can(access: Access) {
        if (!_.includes(this.permissions, access)) {
            this.permissions.push(access);
        }
    }

    is(role: IRole): void {
        _.forEach(role.permissions, access => this.can(access));
    }

    has(access: Access) {
        return _.includes(this.permissions, access);
    }
}