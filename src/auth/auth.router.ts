import * as express from 'express';
import * as authController from './auth.controller';

export class AuthRouter {

    public router;

    constructor() {
        this.router = express.Router();
        this.router
            .route('/authenticate')
            .post(authController.authenticate);

        this.router
            .route('/authenticate/token')
            .post(authController.refreshToken)
            .delete(authController.revokeToken);

        this.router
            .route('/authenticate/forgot')
            .post(authController.passwordForgot);
    }
}

