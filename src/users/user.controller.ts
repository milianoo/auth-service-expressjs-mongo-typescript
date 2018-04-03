
import {User} from "./user.model";
import * as lodash from 'lodash';
import { Request, Response, NextFunction } from 'express';
import {UserStatus} from './status.types';
import {sendVerificationEmail} from './user.notifier';
import {Company} from '../company/company.model';

export const isUsernameAvailable = (req: Request, res: Response) => {

    User.count({ email: req.params.username })
        .then((count) => {
            res.send({ exist: count > 0 });
        }).catch(err => {
            res.send({ reason: 'BadRequest', message: 'failed to get the users.' });
    });
};

export const getUsers = (req: Request, res: Response) => {

    User.find(req.query)
        .then((users) => {
            res.send(users);
        }).catch(err => {
        res.send({ reason: 'BadRequest', message: 'failed to get the users.' });
    });
};

export const getUser = (req: Request, res: Response, next: NextFunction) => {

    if (!req.params || !req.params.id){
        return next({ reason: 'BadRequest', message: 'field "id" is required.' });
    }

    User.findOne({ _id: req.params.id})
        .then((user) => {
            res.send(user);
        })
        .catch(err => {
            res.send({ reason: 'BadRequest', message: 'failed to get the user.' });
        });
};

export const activateUser = (req: Request, res: Response) => {

    if (req.body.activation && req.body.email) {

        User.findOne({ _id: req.body.activation, email: req.body.email})
            .then((user) => {
                user.status = UserStatus.Verified;
                user.save()
                    .then(() => res.json(user));
            })
            .catch(err => res.status(400).send({ reason: 'BadRequest', message: 'failed to get the user.' }));

    }else {
        res.status(400).send({ reason: 'BadRequest', message: 'invalid request format.' });
    }
};

export const resendEmail = (req: Request, res: Response) => {

    sendVerificationEmail(req.user._id, req.user.email, req.user.name);

    res.status(200).send();
};

export const createUser = (req: Request, res: Response) => {

    if (req.body.email) {
        let domain = req.body.email.split('@')[1];

        let query = { domain: domain },
            options = { upsert: true, new: true, setDefaultsOnInsert: true };

        Company.findOneAndUpdate(query, {}, options)
            .then(company => {

                if (company.isNew) {
                    console.info('new company created.');
                }

                let user = new User();

                let fields = Object.keys(req.body);
                lodash.forEach(fields, field => {
                    user[ field ] = req.body[ field ];
                });

                user.companyId = company._id;
                user.status = UserStatus.Pending_Verification;

                user.validate()
                    .then(() => {

                        user.save()
                            .then(() => {

                                sendVerificationEmail(user._id, user.email, `${user.firstName} ${user.lastName}`);

                                res.status(201).send({ message: 'new user created.', data: user });
                            })
                            .catch((err) => {
                                console.error(err);
                                res.status(400).send({ reason: 'BadRequest', message: 'failed to save the user.' });
                            });
                    })
                    .catch(err => {
                        console.log(err);
                        return res.status(400).send({ reason: 'BadRequest', message: 'required fields are not set.' });
                    });

            });
    }
};

export const updateUser = (req: Request, res: Response, next: NextFunction) => {

    if (!req.params || !req.params.id){
        return res.send({ reason: 'BadRequest', message: 'field "id" is required.' });
    }

    User.findById( req.params.id,  (err, user) => {
        if (err){
            next(err);
        }

        let fields = Object.keys(req.body);
        lodash.forEach(fields, field => {
                user[ field ] = req.body[ field ];
        });

        user.save()
            .then(() => res.json(user))
            .catch((err) => {
                console.log(err);
                return res.send({ reason: 'BadRequest', message: 'failed to save the user.' });
            });
    });

};

export const deleteUser = (req: Request, res: Response, next: NextFunction) => {

    if (!req.params || !req.params.id){
        return res.send({ reason: 'BadRequest', message: 'field "id" is required.' });
    }

    User.findByIdAndRemove(req.params.id, (err) => {
        if (err)
            res.send(err);

        res.json({ message: 'User removed!' });
    });

};