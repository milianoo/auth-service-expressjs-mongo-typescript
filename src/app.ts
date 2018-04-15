import * as express from 'express';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';
import * as passport from 'passport';
import * as cors from 'cors';
import * as helmet from 'helmet';

import { MongoDb } from './bin/mongodb';
import { AuthMiddleware } from './auth/auth.middleware';

import { AuthRouter } from './auth/auth.router';
import { UserRouter } from './users/user.router';
import { QuestionsRouter } from './survey/questions/questions.router';
import { CategoryRouter } from './survey/category/category.router';
import { SurveyRouter } from './survey/survey.router';
import { CompanyRouter } from './company/company.router';
import * as config from 'config';
import * as debug from 'debug';
const log = debug('api:express');

class App {

    public express: express.Application;

    constructor() {

        // setup connections
        MongoDb.connect();

        // setup express app
        this.express = express();
        this.middleware();
        this.routes();
        log(`express setup completed.`);
    }

    // Configure Express middleware.
    private middleware(): void {
        this.express.use(helmet());
        this.express.use(morgan('combined'));
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
        this.express.use(cors({
            origin: (origin, next) => {
                if(!origin) return next(null, true);
                if(config.get('allowed_origins').indexOf(origin) === -1 ){
                    log(`CORS unknown access rejected : ${origin}`);
                    let msg = `The CORS policy for this site does not allow access from the specified Origin.`;
                    return next(new Error(msg), false);
                }
                return next(null, true);
            }
        }));
        this.express.use(passport.initialize());
        AuthMiddleware.setup(passport);
    }

    private routes(): void {

        let auth = new AuthRouter().router;
        let user = new UserRouter().router;
        let company = new CompanyRouter().router;
        let questions = new QuestionsRouter().router;
        let category = new CategoryRouter().router;
        let survey = new SurveyRouter().router;

        let enabledRoutes = [
            auth,
            user,
            company,
            questions,
            category,
            survey
        ];

        this.express.use('/api', enabledRoutes);

        // enabledRoutes.forEach(router =>
        //     router.stack.forEach(layer => {
        //         console.log(`${layer.route.path}  \n\t ${layer.route.stack.map(l => l.name === 'authenticate' ? '(auth)' : `${l.method} | `).join(' ')} \n`);
        //     }));
    }
}

export default new App().express;