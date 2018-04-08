import * as express from 'express';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';
import * as passport from 'passport';
import * as cors from 'cors';

import { Database } from './bin/database';
import { AuthMiddleware } from './auth/auth.middleware';

import { AuthRouter } from './auth/auth.router';
import { UserRouter } from './users/user.router';
import { QuestionsRouter } from './survey/questions/questions.router';
import { CategoryRouter } from './survey/category/category.router';
import { SurveyRouter } from './survey/survey.router';
import { CompanyRouter } from './company/company.router';

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
        this.express.use(morgan('combined'));
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
        this.express.use(cors());
        this.express.use(passport.initialize());
        AuthMiddleware.setup(passport);
    }

    private routes(): void {

        this.express.use('/api', [
            new AuthRouter().router,
            new UserRouter().router,
            new CompanyRouter().router,
            new QuestionsRouter().router,
            new CategoryRouter().router,
            new SurveyRouter().router
        ]);
    }
}

export default new App().express;