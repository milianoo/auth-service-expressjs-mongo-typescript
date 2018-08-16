import * as express from 'express';
import * as controller from './user.controller';
import {auth} from '../auth/auth.middleware';

export class UserRouter {

    public router;

    constructor() {
        this.router = express.Router();

        // this.router
        //     .route('/users/password/reset')
        //     .post(controller.passwordForgot)
        //     .put(controller.updatePassword);
        this.router
            .route('/users/name/:username/exist')
            .get(controller.isUsernameAvailable);

        this.router
            .route('/users/:username/activate')
            .post(auth.authenticate(), controller.activateUser);

        this.router
            .route('/users/:username/activate');
        // .put(auth.authenticate(), controller.resendEmail)

        this.router
            .route('/users')
            .post(controller.createUser)
            .get(auth.authenticate(), controller.getUsers);

        this.router
            .route('/users/:id')
            .get(auth.authenticate(), controller.getUser)
            .put(auth.authenticate(), controller.updateUser)
            .delete(auth.authenticate(), controller.deleteUser);

    }
}