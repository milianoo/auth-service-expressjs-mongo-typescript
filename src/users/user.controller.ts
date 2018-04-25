import * as csvUtil from '../utils/csv.utils';

import * as debug from 'debug';
import {User} from "./user.model";
import * as lodash from 'lodash';
import {UserType} from './user.types';
import {UserStatus} from './status.types';
import { Request, Response, NextFunction } from 'express';
import {Company} from '../company/company.model';
import * as tokenManager from '../tokens/token.controller';

import {sendResetPasswordEmail} from '../notifications/notifiers/forgot-password.notifier';
import {sendVerificationEmail} from '../notifications/notifiers/email-verification.notifier';

const log = debug('api:users:controller');

const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

export const passwordForgot = (req, res) => {

    if (req.body.email && req.body.redirect) {
        User.findOne({email: req.body.email})
            .then( user => {

                if (user) {
                    tokenManager.addToken(user.email)
                        .then((token) => {

                            sendResetPasswordEmail(req.body.redirect, token.code, user.email);

                            res.status(200).send({});
                        });
                }else {
                    res.status(404).send({ reason: 'NotFound', message: 'user not found' });
                }

            })
    }
};

export const updatePassword = (req, res) => {

    if (req.body.code &&
        req.body.email && req.body.password
    ) {
        tokenManager.verifyToken(req.body.code, req.body.email)
            .then((token) => {

                if (token) {
                    tokenManager.removeToken(token._id);
                    User.findOne({ email: token.reference })
                        .then((user) => {
                            if (user) {
                                user.password = req.body.password;
                                user.save()
                                    .then(() => res.status(200).send({}))
                                    .catch(() => res.status(400).send({ reason: 'BadRequest', message: 'failed to update user' }));
                            }else {
                                res.status(400).send({ reason: 'BadRequest', message: 'failed to find user' });
                            }
                        })
                        .catch(() => res.status(400).send({ reason: 'BadRequest', message: 'failed to get user' }));
                }else {
                    res.status(400).send({ reason: 'BadRequest', message: 'could not validate the request' });
                }
            });
    }
};

export const isUsernameAvailable = (req: Request, res: Response) => {

    log(`isUsernameAvailable : ${req.params.username}`);

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
        res.status(400).send({ reason: 'BadRequest', message: 'failed to get the users.' });
    });
};

export const exportCsv = (req: Request, res: Response) => {

    User.find(req.query)
        .then((users) => {

            const fields = [
                {
                    label: 'Anrede',
                    value: 'title'
                },
                {
                    label: 'Vorname',
                    value: 'firstName'
                },
                {
                    label: 'Nachname',
                    value: 'lastName'
                },{
                    label: 'Email',
                    value: 'email'
                },{
                    label: 'EinwilligungDatenschutzUndErstinformation',
                    value: (row, field) => row.termsAndConditions ? 'Ja' : 'Nein'
                },
                {
                    label: 'Erstellt',
                    value: (row, field) => row.createdAt.toLocaleString()
                }
            ];

            let csv = csvUtil.convertArrayToCsv(users, fields);
            res.send(csv);

        }).catch(err => {
        res.status(400).send({ reason: 'BadRequest', message: 'failed to get the users.' });
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

    let fullname = `${capitalizeFirstLetter(req.user.title)} ${capitalizeFirstLetter(req.user.lastName)}`;

    let redirect: string = req.query.redirect;

    sendVerificationEmail(redirect, req.user._id, req.user.email, fullname);

    res.status(200).send();
};

export const createUser = (req: Request, res: Response) => {

    if (req.body.user.email) {
        let domain = req.body.user.email.split('@')[1];

        let query = { domain: domain },
            options = { upsert: true, new: true, setDefaultsOnInsert: true };

        Company.findOneAndUpdate(query, {}, options)
            .then(company => {

                if (company.isNew) {
                    console.info('new company created.');
                }

                let user = new User();

                let fields: any = Object.keys(req.body.user);

                delete fields.role;
                delete fields.permissions;

                lodash.forEach(fields, field => {
                    user[ field ] = req.body.user[ field ];
                });

                user.companyId = company._id;
                user.status = UserStatus.Pending_Verification;

                user.validate()
                    .then(() => {

                        user.save()
                            .then(() => {

                                let fullname = `${capitalizeFirstLetter(user.title)} ${capitalizeFirstLetter(user.lastName)}`;

                                sendVerificationEmail(req.body.redirect, user._id, user.email, fullname);

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

        let fields : any = Object.keys(req.body);

        if (req.user.role != UserType.Admin){
            delete fields.role;
            delete fields.permissions;
        }

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