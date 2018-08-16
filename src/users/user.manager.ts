import {User} from './user.model';
import * as bcrypt from 'bcrypt-nodejs';
import logger from '../logger';
import {IUserModel} from './user.interface';

interface IUserManager {
    getById;
    removeById;
    getByEmail;
    getByUsername;
    isUsernameAvailable;
    getAllUsers;
}

class UserManagerClass implements IUserManager {

    public onSave(user: IUserModel) {
        return new Promise((done) => {

            // Break out if the password hasn't changed
            if (!user.isModified('password')) {
                return done();
            }

            // Password changed so we need to hash it
            bcrypt.genSalt(10, (err, salt) => {
                if (err) {
                    logger.error(err);
                    throw new Error(`failed generating salt, username : "${user.username}".`);
                }

                bcrypt.hash(user.password, salt, null, (err, hash) => {
                    if (err) {
                        logger.error(err);
                        throw new Error(`failed hashing password, username : "${user.username}".`);
                    }
                    user.password = hash;
                    done();
                });
            });
        });
    }

    public verifyPassword(password: string, hash: string) {
        return new Promise((done) => {
            bcrypt.compare(password, hash, (err, isMatch) => {
                if (err) {
                    return done();
                }
                done(isMatch);
            });
        });
    }

    public async getById(id: string): Promise<IUserModel> {
        return await User.findById(id);
    }

    public async removeById(id: string): Promise<IUserModel> {
        return await User.findByIdAndRemove(id);
    }

    public async getByEmail(email: string): Promise<IUserModel> {
        return await User.findOne({ email: email });
    }

    public async getByUsername(username: string): Promise<IUserModel> {
        return await User.findOne({ username: username });
    }

    public async isUsernameAvailable(username: string): Promise<boolean> {
        let count = await User.count({ username: username });

        return count === 0;
    }

    public async getAllUsers( query: any): Promise<IUserModel[]> {
        return await User.find(query);
    }
}

export const UserManager = new UserManagerClass();