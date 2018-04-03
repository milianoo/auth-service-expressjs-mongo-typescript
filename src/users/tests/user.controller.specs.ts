import 'mocha';
import { expect } from 'chai';
import * as sinon from 'sinon';
import * as mongoose from 'mongoose';
import { Response, Request, Express } from 'express';

import { createUser, getUser, updateUser, deleteUser, getUsers } from '../user.controller';
import { User } from '../user.model';
import * as assert from 'assert';
import {UserType} from '../user.types';

describe('User Controller', () => {

    describe('getUser', () => {

        let findOneStub;

        before(() => {
            findOneStub = sinon.stub(User, 'findOne');
            findOneStub.returns({});
        });

        afterEach(() => {
            findOneStub.reset();
        });

        it('should find a user with provided id', function () {

            let req = {
                params: { id: '12345' }
            };
            let res: Response;


            getUser(<Request>req, <Response>res, (err) => {});

            assert(findOneStub.calledOnce);
        });

        it('should fail if id is not provided', function () {

            let req = {
                params: {}
            };
            let res: Response;

            getUser(<Request>req, <Response>res, (err) => {});

            assert(findOneStub.notCalled);
        });

    });

    describe('createUser', () => {

        let saveStub;

        before(() => {
            saveStub = sinon.stub(User.prototype, 'save');
            saveStub.returns({});
        });

        afterEach(() => {
            saveStub.reset();
        });

        it('should not call save if any new user property is not provided', function () {

            let req = {
                body: {
                    name: 'example user',
                    email: 'userA@example.com',
                    password: '12345'
                }
            };
            let res: Response;

            createUser(<Request>req, <Response>res);
            assert(saveStub.notCalled);
        });

    });


});