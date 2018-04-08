import * as mongoose from  'mongoose' ;
import config from './config';

class MongoDatabase {

    databaseUri: string;

    constructor() {
        this.databaseUri = config.mongodbPath + config.databaseName;

        mongoose.connection.on('connected', this.onConnected);

        mongoose.connection.on('error',this.onError);

        mongoose.connection.on('disconnected', this.onDisconnected);

        process.on('SIGINT', function() {
            mongoose.connection.close(function () {
                console.log('Mongoose default connection disconnected through app termination');
                process.exit(0);
            });
        });
    }

    public connect() {
        mongoose.connect(this.databaseUri).then(function () {
            console.info('Mongoose connected to mongodb instance.');
        });
        mongoose.set('debug', true);
    }
    private onConnected() {
        console.log(`Mongoose default connection open to ${this.databaseUri}`);
    }
    private onError(err) {
        console.log('Mongoose default connection error: ' + err);
    }
    private onDisconnected() {
        console.log('Mongoose default connection disconnected');
    }
}

export const Database = new MongoDatabase();