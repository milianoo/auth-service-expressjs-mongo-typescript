import {UserStatus} from './user.status.enum';
import {UserType} from './user.type.enum';

export const userSchemaModel = {
    status: {
        type: UserStatus,
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
    role: {
        type: String,
        required: true,
        default: UserType.User
    },
    company: {
        type: String
    },
    acceptedLegalTerms: {
        type: Boolean,
        required: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    permissions: {
        type: Array,
        required: false,
        default: []
    }
};