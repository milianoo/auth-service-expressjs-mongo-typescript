import * as debug from 'debug';
import * as lodash from 'lodash';

import {User} from './user.model';
import {UserType} from './user.type.enum';
import {UserStatus} from './user.status.enum';
import { Request, Response, NextFunction } from 'express';
import {UserManager} from './user.manager';
import * as HttpStatus from 'http-status-codes';
import {ErrorResponse, SuccessResponse} from '../common/response.model';
import {ResponseErrorCode} from '../common/responseCodes.enum';
import logger from '../logger';


const log = debug('api:users:controller');

export const isUsernameAvailable = async (req: Request, res: Response) => {

    log(`isUsernameAvailable : ${req.params.username}`);

    let available = await UserManager.isUsernameAvailable(req.params.username);
    if (available) {
        return res
            .status(HttpStatus.OK)
            .send({ exist: false });

    } else {
        return res
            .status(HttpStatus.OK)
            .send({ exist: true });
    }
};

export const getUsers = async (req: Request, res: Response) => {

    try {
        let users = await UserManager.getAllUsers(req.query);
        return res
            .status(HttpStatus.OK)
            .send(new SuccessResponse(users));


    } catch (ex) {
        logger.error(ex);
        return res
            .status(HttpStatus.BAD_REQUEST)
            .send(new ErrorResponse(ResponseErrorCode.BadRequest, 'failed to get users.'));
    }
};

export const getUser = async (req: Request, res: Response, next: NextFunction) => {

    if (!req.params || !req.params.id) {
        return next(new ErrorResponse(ResponseErrorCode.BadRequest, 'field "_id" is required.'));
    }

    try {
        let user = await UserManager.getById(req.params.id);
        return res
            .status(HttpStatus.OK)
            .send(new SuccessResponse(user));

    } catch (ex) {
        logger.error(ex);
        return res
            .status(HttpStatus.BAD_REQUEST)
            .send(new ErrorResponse(ResponseErrorCode.BadRequest, 'failed to get user.'));
    }
};

export const activateUser = async (req: Request, res: Response) => {

    if (!req.params || !req.params.username) {
        return res
            .status(HttpStatus.BAD_REQUEST)
            .send(new ErrorResponse(ResponseErrorCode.BadRequest, 'field "username" is required.'));
    }

    try {
        let user = await UserManager.getByUsername(req.params.username);

        if (user && user._id === req.body.activation) {
            user.status = UserStatus.Verified;
            return res
                .status(HttpStatus.OK)
                .send(new SuccessResponse(user));
        } else {
            return res
                .status(HttpStatus.BAD_REQUEST)
                .send(new ErrorResponse(ResponseErrorCode.BadRequest, 'could not verify the user.'));
        }

    } catch (ex) {
        logger.error(ex);
        return res
            .status(HttpStatus.BAD_REQUEST)
            .send(new ErrorResponse(ResponseErrorCode.BadRequest, 'failed to get the user.'));
    }
};

export const createUser = (req: Request, res: Response) => {

    if (!req.params ||
        !req.params.username ||
        !req.params.email ||
        !req.params.password
    ) {
        return res
            .status(HttpStatus.BAD_REQUEST)
            .send(new ErrorResponse(ResponseErrorCode.BadRequest, 'provide required fields.'));
    }

    let user = new User();

    let fields: any = Object.keys(req.body.user);
    delete fields.role;
    delete fields.permissions;
    delete fields.status;

    lodash.forEach(fields, field => {
        user[ field ] = req.body.user[ field ];
    });

    user.role = UserType.User;
    user.status = UserStatus.Pending;

    user.validate()
        .then(() => {

            user.save()
                .then(() => {

                    return res
                        .status(HttpStatus.OK)
                        .send(new SuccessResponse(user));
                })
                .catch((err) => {
                    logger.error(err);
                    return res
                        .status(HttpStatus.BAD_REQUEST)
                        .send(new ErrorResponse(ResponseErrorCode.BadRequest, `failed to create the user, username: '${req.params.username}'.`));
                });
        })
        .catch(err => {
            logger.error(err);
            return res
                .status(HttpStatus.BAD_REQUEST)
                .send(new ErrorResponse(ResponseErrorCode.BadRequest,
                    `failed to create user, required fields are not set, username: '${req.params.username}'.`));
        });
};

export const updateUser = async (req: Request, res: Response) => {

    if (!req.params || !req.params.id) {
        return res
            .status(HttpStatus.BAD_REQUEST)
            .send(new ErrorResponse(ResponseErrorCode.BadRequest, 'field "id" is required.'));
    }

    try {
        let user = await UserManager.getById(req.params.id);

        if (user) {

            let fields : any = Object.keys(req.body);
            delete fields.role;
            delete fields.permissions;
            delete fields.status;

            lodash.forEach(fields, field => {
                user[ field ] = req.body[ field ];
            });

            user.save()
                .then(() => res.json(user))
                .catch((err) => {
                    logger.error(err);
                    return res
                        .status(HttpStatus.BAD_REQUEST)
                        .send(new ErrorResponse(ResponseErrorCode.NotFound, `user not found, id: '${req.params.id}'`));
                });

        } else {

            return res
                .status(HttpStatus.BAD_REQUEST)
                .send(new ErrorResponse(ResponseErrorCode.NotFound, `user not found, id: '${req.params.id}'`));
        }
    } catch (ex) {

        logger.error(ex);
        return res
            .status(HttpStatus.BAD_REQUEST)
            .send(new ErrorResponse(ResponseErrorCode.BadRequest, `failed to update user, id: '${req.params.id}'`));
    }
};

export const deleteUser = async (req: Request, res: Response) => {

    if (!req.params || !req.params.id) {
        return res
            .status(HttpStatus.BAD_REQUEST)
            .send(new ErrorResponse(ResponseErrorCode.BadRequest, 'field "id" is required.'));
    }

    try {
        let result = await UserManager.removeById(req.params.id);
        if (result) {
            return res
                .status(HttpStatus.OK)
                .send(new SuccessResponse(result));
        }

    } catch (ex) {

        logger.error(ex);
        return res
            .status(HttpStatus.BAD_REQUEST)
            .send(new ErrorResponse(ResponseErrorCode.BadRequest, `failed to remove user, id: '${req.params.id}'`));
    }

};