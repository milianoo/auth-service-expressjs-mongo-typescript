import * as jwt from 'jsonwebtoken';
import * as passport from 'passport';
import * as randToken from 'rand-token';
import config from "../bin/config";
import {User} from "../users/user.model";

let activeTokens = [];

let getAuthTokenJsonResponse = function (user) {

    let token = jwt.sign(user.toJSON(), config.secret, {
        expiresIn: '1 day'
    });
    let refreshToken = randToken.uid(256);
    activeTokens[ refreshToken ] = user._id;
    return { token: token, refreshToken: refreshToken };
};

export const authenticate = function(req, res) {

    let name = req.body.username;
    if (!name) {
        res.status(400)
            .send({ reason: 'BadRequest', message: 'field "name" is required.' });
        return;
    }

    User.findOne({
        name: name
    }, function(err, user) {
        if (err) throw err;

        if (!user) {
            res.status(404)
                .send({ reason: 'NotFound', message: 'requested "username" not found.' });
        } else {

            User.comparePassword(req.body.password, user.password, function(err, isMatch) {
                if (isMatch && !err) {

                    res.status(200)
                        .json( getAuthTokenJsonResponse(user) );
                } else {
                    res.status(401)
                        .send({ reason: 'Unauthorized', message: 'user is not authorized.' });
                }
            });
        }
    });
};

export const refreshToken = function (req, res) {

    let refreshToken = req.body.refreshToken;
    let userId = req.body.id;

    if((refreshToken in activeTokens) && (activeTokens[ refreshToken ] == userId)) {

        User.findOne({
            _id: userId
        }, function (err, user) {

            if (!user) {
                res.status(404)
                    .send({ reason: 'NotFound', message: 'requested "username" not found.' });
            } else {

                res.status(200)
                    .json( getAuthTokenJsonResponse(user) );
            }
        });
    }
    else {
        res.status(401).send({ reason: 'Unauthorized', message: 'user is not authorized.' });
    }
};

export const revokeToken = function (req, res) {

    let refreshToken = req.body.refreshToken;
    let userId = req.body.id;

    if((refreshToken in activeTokens) && (activeTokens[ refreshToken ] === userId)) {
        delete activeTokens[refreshToken];
        res.send(204);
    }else{
        res.send(304);
    }
};

export const isAuthenticated = passport.authenticate('jwt', { session: false });
