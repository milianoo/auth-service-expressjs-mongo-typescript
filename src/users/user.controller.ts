
import {User} from "./user.model";
import * as lodash from 'lodash';
import { Request, Response, NextFunction } from 'express';

export const getUsers = (req: Request, res: Response) => {

    User.find({}, function(err, users) {

        let result = lodash.map(users, (user) => {
            let res = user.toObject({ hide: 'password', transform: true});
            return res;
        });

        res.send(result);
    });
};

export const getUser = (req: Request, res: Response) => {

    User.findOne({ _id: req.params.id}, function(err, user) {

        let result = user.toObject();
        delete result.password;

        res.send(result);
    });
};

export const postUser = (req: Request, res: Response) => {

    let user = new User();

    user.name = req.body.name;
    user.email = req.body.email;
    user.type = req.body.type;
    user.password = req.body.password;

    user.save(function (err) {
        if (err){
            res.status(400).send({ reason: 'BadRequest', message: 'field "name", "type" and "password" are required.' });
            return;
        }
        res.status(201).send({ message: 'New User Created.', data: user });
    });
};

export const putUser = (req: Request, res: Response, next: NextFunction) => {

    User.findById( req.params.id, function (err, user) {
        if (err){
            next(err);
        }

        // TODO : Perform update here

        res.json(user);
    });

};

export const deleteUser = (req: Request, res: Response, next: NextFunction) => {

    User.findByIdAndRemove(req.params.id, function(err) {
        if (err)
            res.send(err);

        res.json({ message: 'User removed!' });
    });

};