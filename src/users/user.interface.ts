import {Document} from "mongoose";
import {UserStatus} from './status.types';

export interface IUser extends Document {

    status: UserStatus;

    email?: string;

    firstName?: string;

    lastName?: string;

    companyId?: string;

    password?: string;

    role?: number;

    permissions: Array<number>;
}

export interface IUserModel {

    name(): string;

    comparePassword(password: string, hash: string, callback: Function): void;

    findByEmail(email: string, callback: Function): void;
}
