import * as debug from 'debug';
import * as config from 'config';
import * as redis from 'redis';

const log = debug('api:redis');

class RedisDatabase {

    private client;

    constructor() {
        // empty-block
    }

    private onConnected() {
        log('Redis client connected to redis server.');
    }

    private onError(err: any) {
        log('error occured on redis client', err);
    }

    public enabled() {
        return config.get('redis.enabled') === 'true';
    }

    public set(key: string, value: string) {
        this.client.set(key, value, redis.print);
    }

    public get(key: string) {
        return new Promise((resolve, reject) => {
            this.client.get(key, (err, reply) => {
                if (err) {
                    reject(err);
                }
                resolve(reply.toString());
            });
        });
    }

    public delete(key: string) {
        return new Promise((resolve, reject) => {
            this.client.del(key, function(err: any, data: any) {
                if (err) {
                    reject(err);
                }
                resolve(data);
            });
        });
    }

    public connect() {

        let server = config.get('redis.server');
        let port = config.get('redis.port');

        this.client = redis.createClient(port, server);
        this.client.on('connect', this.onConnected);

        this.client.on('error', this.onError);
    }

}

export const Redis = new RedisDatabase();