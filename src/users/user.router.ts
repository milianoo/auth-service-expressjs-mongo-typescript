import * as express from 'express';
import * as controller from './user.controller';
import {auth} from '../auth/auth.middleware';

export class UserRouter {

    public router;

    constructor() {
        this.router = express.Router();

        this.router
            .route('/users/password/reset')
            .post(controller.passwordForgot)
            .put(controller.updatePassword);

        this.router
            .route('/users/exist/:username')
            .get(controller.isUsernameAvailable);
        
        this.router
            .route('/users/activate')
            .get(auth.authenticate(), controller.resendEmail)
            .post(auth.authenticate(), controller.activateUser);

        this.router
            .route('/users')
            .post(controller.createUser)
            .get(auth.authenticate(), controller.getUsers);

        this.router
            .route('/users/export')
            .get(auth.authenticate(), controller.exportCsv);

        this.router
            .route('/users/:id')
            .get(auth.authenticate(), controller.getUser)
            .put(auth.authenticate(), controller.updateUser)
            .delete(auth.authenticate(), controller.deleteUser);

    }
}