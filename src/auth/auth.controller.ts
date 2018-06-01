import * as HttpStatus from 'http-status-codes';
import logger from '../logger';

import { ResponseErrorCode } from '../common/responseCodes.enum';
import {ErrorResponse, SuccessResponse} from '../common/response.model';
import { AuthManager } from './auth.manager';

export const authenticate = async (req, res) => {

    let username = req.body.username;
    let password = req.body.password;

    if (!username || !password) {
        return res
            .status(HttpStatus.BAD_REQUEST)
            .send(new ErrorResponse(ResponseErrorCode.BadRequest, '"username" and "password" are required.'));

    }

    let token = await AuthManager.authenticate(username, password);

    if (token) {
        logger.info(`user '${username}' authenticated.`);

        return res
            .status(HttpStatus.OK)
            .send( new SuccessResponse(token) );

    }else {
        logger.error(`user '${username}' failed to authenticate.`);

        return res
            .status(HttpStatus.UNAUTHORIZED)
            .send({ reason: ResponseErrorCode.Unauthorized, message: 'authentication failed.' });
    }
};
