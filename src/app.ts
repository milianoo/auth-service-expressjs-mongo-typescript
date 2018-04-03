import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as passport from 'passport';
import * as cors from 'cors';
import * as sql from 'mssql';

import { Database } from './bin/database';
import { AuthMiddleware } from './auth/auth.middleware';

import { AuthRouter } from './auth/auth.router';
import { UserRouter } from './users/user.router';
import { QuestionsRouter } from './survey/questions/questions.router';
import { CategoryRouter } from './survey/category/category.router';
import {SurveyRouter} from './survey/survey.router';
import {CompanyRouter} from './company/company.router';

class App {

    public express: express.Application;

    constructor() {
        this.express = express();
        this.middleware();
        this.routes();
        Database.connect();

        let config = {
            user: 'sa',
            password: 'U!T?VzeS2APj89QZ',
            server: '94.130.77.2',
            port: '49854',
            database: 'VSMATest'
        };

        // sql.connect(config, function (err) {
        //
        //     if (err) console.log(err);
        //
        //     console.log('connected');
        //
        //     let request = new sql.Request();
        //
        //     // query to the database and get the records
        //     request.query('select * from tbl_sc_kunde', function (err, recordset) {
        //
        //         if (err) console.log(err)
        //
        //         console.log(recordset);
        //
        //     });
        // });

    }

    // Configure Express middleware.
    private middleware(): void {
        this.express.use(logger('dev'));
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