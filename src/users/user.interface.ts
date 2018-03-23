import {Document} from "mongoose";

export interface IUser extends Document {

    email?: string;

    name?: string;

    password?: string

    type?: number
}

export interface IUserModel {

    comparePassword(password: string, hash: string, callback: Function): void;

    findByEmail(email: string, callback: Function): void;
}
