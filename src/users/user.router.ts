import * as express from 'express';
import * as userController from './user.controller';

class UserRouter {

    public router;

    constructor() {
        this.router = express.Router();
        this.router
            .route('/users')
            .post(userController.postUser)
            .get(userController.getUsers);

        this.router
            .route('/users/:id')
            .get(userController.getUser)
            .put(userController.putUser)
            .delete(userController.deleteUser);
    }
}


export const usersRouter = new UserRouter().router;