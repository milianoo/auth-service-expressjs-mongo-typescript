import 'mocha';
import 'sinon';
import * as chai from 'chai';

let expect = chai.expect;
import {User} from './user.model';
import {Types} from './user.types';

describe('User Model - Validations', () => {

    it('should be invalid if firstName is empty', function(done) {
        let user = new User();

        user.firstName = '';
        user.lastName = 'test';
        user.email = 'test@example.com';
        user.password = '1234';
        user.type = Types.Users.User;

        user.validate(function(err) {

            expect(err).to.not.be.null;
            expect(err).to.not.be.undefined;
            expect(err.errors).to.exist;
            expect(err.errors).to.not.be.null;
            expect(err.errors).to.not.be.undefined;
            done();
        });
    });

    it('should be invalid if lastName is empty', function(done) {
        let user = new User();

        user.firstName = 'name';
        user.lastName = '';
        user.email = 'test@example.com';
        user.password = '1234';
        user.type = Types.Users.User;

        user.validate(function(err) {

            expect(err).to.not.be.null;
            expect(err).to.not.be.undefined;
            expect(err.errors).to.exist;
            expect(err.errors).to.not.be.null;
            expect(err.errors).to.not.be.undefined;
            done();
        });
    });

    it('should be invalid if email is empty', function(done) {
        let user = new User();

        user.firstName = 'name';
        user.lastName = 'something';
        user.email = '';
        user.password = '1234';
        user.type = Types.Users.User;

        user.validate(function(err) {

            expect(err).to.not.be.null;
            expect(err).to.not.be.undefined;
            expect(err.errors).to.exist;
            expect(err.errors).to.not.be.null;
            expect(err.errors).to.not.be.undefined;
            done();
        });
    });

    it('should be invalid if password is empty', function(done) {
        let user = new User();

        user.firstName = 'name';
        user.lastName = 'something';
        user.email = 'test@example.com';
        user.password = '';
        user.type = Types.Users.User;

        user.validate(function(err) {

            expect(err).to.not.be.null;
            expect(err).to.not.be.undefined;
            expect(err.errors).to.exist;
            expect(err.errors).to.not.be.null;
            expect(err.errors).to.not.be.undefined;
            done();
        });
    });

    it('should be invalid if type is not set', function(done) {
        let user = new User();

        user.firstName = 'name';
        user.lastName = 'something';
        user.email = 'test@example.com';
        user.password = '1234';

        user.validate(function(err) {

            expect(err).to.not.be.null;
            expect(err).to.not.be.undefined;
            expect(err.errors).to.exist;
            expect(err.errors).to.not.be.null;
            expect(err.errors).to.not.be.undefined;
            done();
        });
    });

});