import {Document} from 'mongoose';
import {UserStatus} from './user.status.enum';
import {UserType} from './user.type.enum';

export interface IUser extends Document {

    status: UserStatus;

    type: UserType;

    email: string;

    title?: string;

    firstName?: string;

    lastName?: string;

    username?: string;

    company?: string;

    creator?: string;

    password?: string;

    refreshToken?: string;

    acceptedTerms?: boolean;

    role?: number;

    permissions: Array<number>;

    acceptedLegalTerms: boolean;
}

export interface IUserModel {

    name(): string;

    comparePassword(password: string, hash: string): Promise<any>;

    findByEmail(email: string, callback: Function): void;
}
