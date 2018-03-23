import * as express from 'express';
import * as authController from './auth.controller';

class AuthRouter {

    public router;

    constructor() {
        this.router = express.Router();
        this.router
            .route('/authenticate')
            .post(authController.authenticate);

        this.router
            .route('/token')
            .post(authController.refreshToken)
            .delete(authController.revokeToken);
    }
}


export const authRouter = new AuthRouter().router;

