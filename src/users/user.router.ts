import * as express from 'express';
import * as controller from './user.controller';
import {isAuthenticated, authorize} from '../auth/auth.controller';
import {Access} from './user.access';

export class UserRouter {

    public router;

    constructor() {
        this.router = express.Router();

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
            .get(
                isAuthenticated,
                authorize([
                    Access.View_Management_Users,
                    Access.Edit_Management_Users
                ]),
                controller.getUsers
            );

        this.router
            .route('/users/:id')
            .get(
                isAuthenticated,
                controller.getUser
            )
            .put(
                isAuthenticated,
                controller.updateUser
            )
            .delete(
                isAuthenticated,
                authorize([
                    Access.View_Management_Users,
                    Access.Edit_Management_Users
                ]),
                controller.deleteUser
            );
    }
}