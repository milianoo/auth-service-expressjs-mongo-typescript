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
        this.middleware();
        this.routes();
        this.setErrorHandlers();
        log(`express setup completed.`);
    }

    // Configure Express middleware.
    private middleware(): void {
        this.express.use(helmet());
        this.express.use(frameguard({ action: 'deny' }));
        this.express.use(morgan('combined'));
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
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

        // to log the available paths
        // enabledRoutes.forEach(router =>
        //     router.stack.forEach(layer => {
        //         console.log(
        // `${layer.route.path}  \n\t ${layer.route.stack.map(l => l.name === 'authenticate' ? '(auth)' : `${l.method} | `).join(' ')} \n`);
        //     }));
    }

    private setErrorHandlers(): void {

        this.express.use((err, req, res, next: NextFunction) => {
            // set locals, only providing error in development
            res.locals.message = err.message;
            res.locals.error = req.app.get('env') === 'development' ? err : {};

            logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

            // render the error page
            res.status(err.status || 500);
            res.status(404).send({ message: `unexpected error: ${err.message}`});
        });

        this.express.use((req, res, next) => {
            res.status(404).send({ message: 'resource not available.'});
        });
    }
}

export default new App().express;