import {Schema} from "mongoose";

export const AddressSchema: Schema = new Schema({
    street: { type: String },
    code: { type: String },
    city: { type: String }
});