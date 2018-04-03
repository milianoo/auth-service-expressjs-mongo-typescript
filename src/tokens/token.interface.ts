import {Document} from "mongoose";

export interface IToken extends Document {

    code?: string;

    reference?: string;
}

export interface ITokenModel {

}
