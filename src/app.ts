import * as express from 'express';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as helmet from 'helmet';
import * as frameguard from 'frameguard';
import * as swaggerUi from 'swagger-ui-express';

let swaggerDocument = require('./swagger.json');

import * as config from 'config';
import * as debug from 'debug';
const log = debug('api:express');
import logger from './logger';

import { MongoDb } from './bin/mongodb';
import { Redis } from './bin/redis';
import { auth } from './auth/auth.middleware';
import { AuthRouter } from './auth/auth.router';
import { UserRouter } from './users/user.router';
import {NextFunction} from 'express';

class App {

    public express: express.Application;

    constructor() {

        // setup connections
        MongoDb.connect();

        log(`Redis database is ${ Redis.enabled() ? 'enabled' : 'disabled'}.`);
        if (Redis.enabled()) {
            Redis.connect();
        }

        // setup express app
        this.express = express();
        this.setupMiddleware();
        this.routes();
        this.setErrorHandlers();
        log(`express setup completed.`);
    }

    // Configure Express middlewares.
    private setupMiddleware(): void {
        // takes care of http request headers
        this.express.use(helmet());
        // prevents app to be loaded inside html frames
        this.express.use(frameguard({ action: 'deny' }));
        // configure logging format
        this.express.use(morgan('combined'));
        // express body parsers
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));

        // takes care of CORS requests
        this.express.use(cors({
            origin: (origin, next) => {
                if (!origin) { return next(null, true); }
                if (config.get('allowed_origins').indexOf(origin) === -1 ) {
                    log(`CORS unknown access rejected : ${origin}`);
                    let msg = `The CORS policy for this site does not allow access from the specified Origin.`;
                    return next(new Error(msg), false);
                }
                return next(null, true);
            }
        }));

        // initialize the auth middleware
        this.express.use(auth.initialize());
    }

    private routes(): void {

        this.express.use('/meta', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

        let auth = new AuthRouter().router;
        let user = new UserRouter().router;

        let enabledRoutes = [
            auth,
            user
        ];

        this.express.use('/api', enabledRoutes);
    }

    private setErrorHandlers(): void {

        this.express.use((err, req, res, next: NextFunction) => {
            // set locals, only providing error in development
            res.locals.message = err.message;
            res.locals.error = req.app.get('env') === 'development' ? err : {};

            logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

            res.status(err.status || 500);
            res.status(404).send({ message: `unexpected error: ${err.message}`});
        });

        this.express.use((req, res, next) => {
            res.status(404).send({ message: 'resource not available.'});
        });
    }
}

export default new App().express;