import 'mocha';
import 'sinon';
import * as chai from 'chai';

let expect = chai.expect;
import {User} from '../user.model';
import {Roles} from '../user.roles';

describe('User Model - Validations', () => {

    it('should be valid if user props are set', function(done) {
        let user = new User();

        user.name = 'user valid';
        user.email = 'valid@example.com';
        user.password = '1234';
        user.role = Roles.User;

        user.validate(function(err) {

            expect(err).to.be.null;
            done();
        });
    });

    it('should be invalid if name is empty', function(done) {
        let user = new User();

        user.name = '';
        user.email = 'test@example.com';
        user.password = '1234';
        user.role = Roles.User;

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

        user.name = 'name';
        user.email = '';
        user.password = '1234';
        user.role = Roles.User;

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

        user.name = 'name';
        user.email = 'test@example.com';
        user.password = '';
        user.role = Roles.User;

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

        user.name = 'name';
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