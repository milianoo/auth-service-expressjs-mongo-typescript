import {Redis} from '../bin/redis';
import * as randToken from 'rand-token';

export const addRefreshToken = async (userId: string, token = null) => {

    if (!token) {
        token = randToken.uid(16);
    }

    Redis.client.set(token, userId);
};

export const getTokenUserId = (token: string) => {

    return new Promise((done) => {
        Redis.client.get(token, function(err, data) {
            if (err) done();
            done(data);
        });
    });
};

export const removeRefreshToken = (token: string) => {

    return new Promise((done) => {
        Redis.client.del(token, function(err, data) {
            if (err) done();
            done(data);
        });
    });
};
