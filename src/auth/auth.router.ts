import * as express from 'express';
import * as authController from './auth.controller';

export class AuthRouter {

    public router;

    constructor() {
        this.router = express.Router();
        this.router
            .route('/authenticate')
            .post(authController.authenticate);
    }
}

