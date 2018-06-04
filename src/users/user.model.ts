import { Schema, Model, model} from 'mongoose';

import {IUser, IUserModel} from './user.interface';
import {userSchemaModel} from './user.schema';
import {UserManager} from './user.manager';
import logger from '../logger';

export const UserSchema: Schema = new Schema(userSchemaModel, {
    timestamps: true
});

UserSchema.pre('save', async function (callback: Function) {

    let user = <UserModel>this;

    try {
        await UserManager.beforeSave(user);
        callback();

    } catch (ex) {
        logger.error(ex);
        callback(ex);
    }
});

UserSchema.static('comparePassword', UserManager.verifyPassword);
UserSchema.static('findByEmail', UserManager.getByEmail);

export type UserModel = Model<IUser> & IUserModel & IUser;

export const User = <UserModel>model<IUser>('User', UserSchema);
