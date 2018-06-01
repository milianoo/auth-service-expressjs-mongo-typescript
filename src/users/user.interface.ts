import {Document} from "mongoose";
import {UserStatus} from './status.types';

export interface IUser extends Document {

    title?: string;

    firstName?: string;

    lastName?: string;

    email?: string;

    username?: string;

    company?: string;

    creator?: string;

    password?: string;

    refreshToken?: string;

    acceptedTerms?: boolean;

    status: UserStatus;

    role?: number;

    permissions: Array<number>;
}

export interface IUserModel {

    name(): string;

    comparePassword(password: string, hash: string): Promise<any>;

    findByEmail(email: string, callback: Function): void;
}
