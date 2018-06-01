import 'mocha';
import { expect } from 'chai';
import * as sinon from 'sinon';
require("sinon-mongoose");

import { AuthManager } from '../../src/auth/auth.manager';
import { User } from '../../src/users/user.model';

describe('authentication', () => {

    let userMock: any;

    beforeEach(function () {

        let user = new User();
        user.username = 'test-user';
        user.password = '$2a$10$XAHLJNT5Dz7.CYopuP.EBeiIv.Smi6OZB54.ES4HlUZL5kcYElaW2';

        userMock = sinon.mock(User)
            .expects('findOne')
            .chain('select').withArgs('+password')
            .resolves(user);
    });

    afterEach(function () {
        (User.findOne as sinon.SinonStub).restore();
    });

    it('should have authenticate method', () => {

        expect(typeof AuthManager.authenticate).to.equal('function', 'method not found');
    });

    it('should not authenticate if username or password is empty', async function () {

        let result = await AuthManager.authenticate('', '');
        expect(result).to.be.null;
    });

    it('should return token on successful authentication', async function () {

        let result = await AuthManager.authenticate('test-user', '12345678');
        expect(result).to.not.be.null;
        expect(result).to.not.be.undefined;
        expect(result).to.be.an('object');
        expect(result).to.have.a.property('token');
    });

    it('should not return token on failed authentication', async function () {

        let result = await AuthManager.authenticate('test-user', '00000000');
        expect(result).to.be.null;
    });
});