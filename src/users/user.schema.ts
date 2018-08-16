import {StatusTypes} from './user.status.enum';
import {Schema, Types} from 'mongoose';

const userSchemaModel = {
    status: {
        type: StatusTypes,
        required: true
    },
    email: {
        type: String,
        lowercase: true,
        trim: true,
        required: true
    },
    username: {
        type: String,
        lowercase: true,
        trim: true,
        required: true
    },
    title: {
        type: String,
        required: false
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    company: {
        type: Types.ObjectId
    },
    password: {
        type: String,
        required: true,
        select: false
    }
};

export const UserSchema: Schema = new Schema(userSchemaModel, {
    timestamps: true
});