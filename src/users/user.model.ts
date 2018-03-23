import { Schema, Model, model} from "mongoose";
import * as bcrypt from 'bcrypt-nodejs';
import {IUser, IUserModel} from "./user.interface";

export const UserSchema: Schema = new Schema({
    createdAt: { type: Date },
    email: { type: String, required: true },
    name: { type: String, required: true },
    type: { type: Number, required: true },
    password: { type: String, required: true }
});

UserSchema.pre("save", function (callback) {
    let user = this;

    let now = new Date();
    if (!user.createdAt) {
        user.createdAt = now;
    }

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

UserSchema.static('comparePassword', (password: string, hash: string, callback: Function) => {

    console.log(password);
    console.log(hash);

    bcrypt.compare(password, hash, function(err, isMatch) {
        if (err) return callback(err);
        callback(null, isMatch);
    });
});

UserSchema.static('findByEmail', (email: string, callback: Function) => {
    User.findOne({email: email}, callback);
});

export type UserModel = Model<IUser> & IUserModel & IUser;

export const User: UserModel = <UserModel>model<IUser>("User", UserSchema);
