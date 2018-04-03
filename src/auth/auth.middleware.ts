import * as passportJwt from 'passport-jwt';
import { User } from '../users/user.model';
import config from '../bin/config';
import * as passport from 'passport';
import {Roles} from '../users/roles/roles.config';

let JwtStrategy = passportJwt.Strategy;
let ExtractJwt = passportJwt.ExtractJwt;

export const AuthMiddleware = {

    setup(passport: passport.PassportStatic) {

        let opts: any = {};
        opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
        opts.secretOrKey = config.secret;

        passport.use(new JwtStrategy(opts, function(jwt_payload, done) {

            /*
                TODO : Here should check against Redis
                TODO : Admin should be able to disable a token
            */
            let userId = jwt_payload._id;

            // checks if the issued token is still valid
            User.findOne({ _id: userId })
                .then((user) => {

                    if (user) {
                        done(null, user);
                    }
                }).catch((err) =>{
                    done(err, null);
                });
        }));
    }
};

