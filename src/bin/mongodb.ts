import * as mongoose from  'mongoose' ;
import * as debug from 'debug';
import * as config from 'config';

const log = debug('api:database');

class MongoDatabase {

    databaseUri: string;

    constructor() {
        this.databaseUri = config.get('database.path') + config.get('database.name');

        mongoose.connection.on('connected', this.onConnected);

        mongoose.connection.on('error', this.onError);

        mongoose.connection.on('disconnected', this.onDisconnected);

        process.on('SIGINT', function() {
            mongoose.connection.close(function () {
                log('Mongoose default connection disconnected through app termination');
                process.exit(0);
            });
        });
    }

    public connect() {
        mongoose.connect(this.databaseUri).then(function () {
            log('Mongoose connected to mongodb instance.');
        });
        mongoose.set('debug', true);
    }
    private onConnected() {
        log(`Mongoose default connection open to ${this.databaseUri}`);
    }
    private onError(err: any) {
        log('Mongoose default connection error: ' + err);
    }
    private onDisconnected() {
        log('Mongoose default connection disconnected');
    }
}

export const MongoDb = new MongoDatabase();