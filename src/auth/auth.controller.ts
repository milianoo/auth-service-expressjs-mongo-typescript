import * as jwt from 'jsonwebtoken';
import * as passport from 'passport';
import * as randToken from 'rand-token';
import * as config from 'config';
import {User} from "../users/user.model";
import {Roles} from '../users/roles/roles.config';
import {Access} from '../users/user.access';

let activeTokens = [];

let getAuthTokenJsonResponse = function (user) {

    user = user.toObject();
    delete user.password;

    let token = jwt.sign(user, config.get('secret'), {
        expiresIn: '1 day'
    });

    // tokenManager.addToken(user._id)
    //     .then((token) => {
    //
    //     });

    let refreshToken = randToken.uid(256);
    activeTokens[ refreshToken ] = user._id;
    return { token: token, refreshToken: refreshToken };
};

export const authenticate = function(req, res) {

    let email = req.body.username;
    if (!email) {
        res.status(400)
            .send({ reason: 'BadRequest', message: 'field "name" is required.' });
        return;
    }

    User.findOne({ email: email })
        .select('+password')
        .then((user) => {

            console.log(user.email);

            User.comparePassword(req.body.password, user.password, function(err, isMatch) {
                if (isMatch && !err) {

                    res.status(200)
                        .json( getAuthTokenJsonResponse(user) );
                } else {
                    res.status(401)
                        .send({ reason: 'Unauthorized', message: 'user is not authorized.' });
                }
            });

        }).catch(() => {
            res.status(401)
                .send({ reason: 'Unauthorized', message: 'requested "username" not found.' });
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

export const revokeToken = (req, res) => {

    let refreshToken = req.body.refreshToken;
    let userId = req.body.id;

    if((refreshToken in activeTokens) && (activeTokens[ refreshToken ] === userId)) {
        delete activeTokens[refreshToken];
        res.send(204);
    }else{
        res.send(304);
    }
};

export const authorize = (permissions: Array<Access>) => {

    return function(req, res, next) {

        let role = Roles[req.user.role];
        if (role) {
            permissions.forEach(access => {
                if (!role.has(access)) {
                    res.status(403).send({ reason: 'Unauthorized', message: 'action is not authorized.' });
                }
            });

            next();
        }else {
            res.status(403).send({ reason: 'Unauthorized', message: 'action is not authorized.' });
        }
    }

};

export const isAuthenticated = passport.authenticate('jwt', { session: false });
