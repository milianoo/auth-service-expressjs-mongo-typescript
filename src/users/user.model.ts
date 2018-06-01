import { Schema, Model, model} from "mongoose";
import * as bcrypt from 'bcrypt-nodejs';
import {IUser, IUserModel} from "./user.interface";
import {UserStatus} from './status.types';
import {UserType} from './user.types';

export const UserSchema: Schema = new Schema({
    status: { type: UserStatus, required: true },
    email: { type: String, lowercase: true, trim: true, required: true },
    username: { type: String, lowercase: true, trim: true, required: true },
    title: { type: String, required: false },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    role: { type: String, required: true, default: UserType.User },
    companyId: { type: String },
    termsAndConditions: { type: Boolean, required: true },
    password: { type: String, required: true, select: false },
    refreshToken: { type: String, select: false },
    permissions: { type: Array, required: false, default: [] }
},{
    timestamps: true
});

UserSchema.pre("save", function (callback) {
    let user = <UserModel>this;

    // Break out if the password hasn't changed
    if (!user.isModified('password')) {
        return callback();
    }

    // Password changed so we need to hash it
    bcrypt.genSalt(10, function(err, salt) {
        if (err) return callback(err);

        bcrypt.hash(user.password, salt, null, function(err, hash) {
            if (err) return callback(err);
            user.password = hash;
            callback();
        });
    });
});

UserSchema.static('comparePassword', (password: string, hash: string) => {

    return new Promise((done) => {
        bcrypt.compare(password, hash, function(err, isMatch) {
            if (err) return done();
            done(isMatch);
        });
    });


});

UserSchema.static('findByEmail', (email: string, callback: Function) => {
    User.findOne({email: email}, callback);
});

export type UserModel = Model<IUser> & IUserModel & IUser;

export const User = <UserModel>model<IUser>("User", UserSchema);
