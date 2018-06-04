
import * as jwt from 'jsonwebtoken';
import * as config from 'config';
import logger from '../logger';

import {IUser} from '../users/user.interface';
import {User} from '../users/user.model';

class AuthManagerClass {

    private getSignedToken(user: IUser): string {
        user = user.toObject();
        delete user.password;
        delete user.role;
        delete user.permissions;

        return jwt.sign(
            user,
            config.get('secret'),
            { expiresIn: '1 day' });
    }

    private async getUser(username: string): Promise<IUser> {
        return await User.findOne({username: username}).select('+password');
    }

    public async authenticate (username: string, password: string): Promise<any> {

        if (!username) {
            logger.info(`username not provided`);
            return null;
        }

        let user: IUser = await this.getUser(username);

        if (!user) {
            logger.info(`username ${username} does not exist.`);
            return null;
        } else {
            logger.info(`username ${username} authenticating ...`);
        }

        let isMatch = await User.comparePassword(password, user.password);

        if (isMatch) {
            logger.info(`username ${username} authenticated successfully.`);

            return {
                token: this.getSignedToken(user)
            };
        } else {
            logger.info(`username ${username} provided invalid password.`);

            return null;
        }
    }
}

export const AuthManager = new AuthManagerClass();