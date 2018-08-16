import { Model, model} from 'mongoose';

import {IUserModel} from './user.interface';
import {UserManager} from './user.manager';
import logger from '../logger';
import {UserSchema} from './user.schema';

UserSchema.pre('save', async function (callback: Function) {

    let user = this;

    try {
        await UserManager.onSave(user);
        callback();

    } catch (ex) {
        logger.error(ex);
        callback(ex);
    }
});

UserSchema.static('comparePassword', UserManager.verifyPassword);
UserSchema.static('findByEmail', UserManager.getByEmail);

export const User: Model<IUserModel> = model<IUserModel>('User', UserSchema);
