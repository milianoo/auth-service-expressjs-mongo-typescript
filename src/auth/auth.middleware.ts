import * as passportJwt from 'passport-jwt';
import * as config from 'config';
import * as passport from 'passport';

import { ResponseErrorCode } from '../common/responseCodes.enum';
import { ErrorResponse } from '../common/response.model';
import { User } from '../users/user.model';
import logger from '../logger';

let JwtStrategy = passportJwt.Strategy;
let ExtractJwt = passportJwt.ExtractJwt;

const params = {
    secretOrKey: config.get('secret'),
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt')
};

let strategy = new JwtStrategy(params, function(jwt_payload, done) {

    let userId = jwt_payload._id;

    // token is verified, proceed to check user
    // TODO : it is possible to cache user at this point or read from payload, need to check it.

    User.findOne({ _id: userId })
        .then((user) => {

            if (user) {
                done(null, user);
            }
        })
        .catch((err) =>{
            done(err, null);
        });
});

passport.use(strategy);

export const auth = {
    initialize: function() {
        return passport.initialize();
    },
    authenticate: function() {
        return (req, res, next) => {

            passport.authenticate("jwt", config.get('jwtSession'), (err, user, info) => {

                if (err) {
                    logger.error(err);
                    return res
                        .status(400)
                        .send(new ErrorResponse(ResponseErrorCode.BadRequest, 'authentication failed.'));
                }

                if (!user) {
                    logger.error('token verification failed.');
                    logger.debug(info);
                    return res
                        .status(400)
                        .send(new ErrorResponse(ResponseErrorCode.BadRequest, 'authentication failed.'));
                }

                next();

            })(req, res, next);
        };
    }
};

