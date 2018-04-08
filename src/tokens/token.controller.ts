import * as randToken from 'rand-token';
import {Token} from './token.model';

export const addToken = (entityRef: string) => {

    let token = new Token();
    token.code = randToken.uid(16);
    token.reference = entityRef;
    return token.save();
};

export const verifyToken = (code: string, entityRef: string) => {
    return Token.findOne({
        code: code,
        reference: entityRef
    });
};

export const removeToken = (_id: string) => {
   Token.remove({_id: _id}).then(() => console.log(`token ${_id} removed.`));
};