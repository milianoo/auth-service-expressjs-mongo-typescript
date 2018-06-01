import {Redis} from '../bin/redis';
import * as randToken from 'rand-token';

export const addRefreshToken = async (userId: string, token = null) => {

    if (!token) {
        token = randToken.uid(16);
    }

    Redis.set(token, userId);
};

export const getTokenUserId = (key: string) => {

    return new Promise((done) => {
        Redis.get(key)
            .then((data) => {
                return data;
            }).catch((err) => {
                console.log(err);
            });
    });
};

export const removeRefreshToken = (token: string) => {

    return new Promise((done) => {
        Redis.delete(token)
            .then((data) => {
                return data;
            }).catch((err) => {
                console.log(err);
            });
    });
};
