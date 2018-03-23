import * as passportJwt from 'passport-jwt';
import { User } from '../users/user.model';
import config from '../bin/config';
import * as passport from 'passport';

let JwtStrategy = passportJwt.Strategy;
let ExtractJwt = passportJwt.ExtractJwt;

export const AuthenticationMiddleware = {

    setup(passport: passport.PassportStatic) {

        let opts: any = {};
        opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
        opts.secretOrKey = config.secret;

        passport.use(new JwtStrategy(opts, function(jwt_payload, done) {

            /*
                TODO : Here should check against Redis
                TODO : Admin should be able to disable a token
            */

            // checks if the issued token is still valid
            User.findOne({ id: jwt_payload.id }, function(err, user) {
                if (err) {
                    return done(err, false);
                }
                if (user) {
                    done(null, user);
                } else {
                    done(null, false);
                    // or you could create a new account
                }
            });
        }));
    }
};

