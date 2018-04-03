import {model, Model, Schema} from "mongoose";
import {IToken, ITokenModel} from './token.interface';

export const TokenSchema: Schema = new Schema({
    code: { type: String, trim: true, required: true },
    reference: { type: String, trim: true, required: true },
},{
    timestamps: true
});

export type TokenModel = Model<IToken> & ITokenModel & IToken;

export const Token = <TokenModel>model<IToken>("Tokens", TokenSchema);