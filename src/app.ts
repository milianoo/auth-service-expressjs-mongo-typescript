import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as passport from 'passport';
import * as cors from 'cors';

import { Database } from './bin/database';
import { authRouter } from './auth/auth.router';
import { usersRouter } from './users/user.router';
import { AuthenticationMiddleware } from './auth/auth.middleware';

class App {

    public express: express.Application;

    constructor() {
        this.express = express();
        this.middleware();
        this.routes();
        Database.connect();
    }

    // Configure Express middleware.
    private middleware(): void {
        this.express.use(logger('dev'));
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
        this.express.use(cors());
        this.express.use(passport.initialize());
        AuthenticationMiddleware.setup(passport);
    }

    private routes(): void {

        this.express.use('/api', [
            authRouter,
            usersRouter
        ]);
    }

}

export default new App().express;