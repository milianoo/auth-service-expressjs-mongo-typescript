import * as express from 'express';
import * as controller from './user.controller';
import {isAuthenticated, authorize} from '../auth/auth.controller';

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
            .get(isAuthenticated, controller.resendEmail)
            .post(isAuthenticated, controller.activateUser);

        this.router
            .route('/users')
            .post(controller.createUser)
            .get(isAuthenticated, controller.getUsers);

        this.router
            .route('/users/export')
            .get(isAuthenticated, controller.exportCsv);

        this.router
            .route('/users/:id')
            .get(isAuthenticated, controller.getUser)
            .put(isAuthenticated, controller.updateUser)
            .delete(isAuthenticated, controller.deleteUser);

    }
}