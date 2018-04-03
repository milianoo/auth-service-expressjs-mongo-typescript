import * as express from 'express';
import * as controller from './company.controller';
import {isAuthenticated, authorize} from '../auth/auth.controller';

export class CompanyRouter {

    public router;

    constructor() {
        this.router = express.Router();
        
        this.router
            .route('/company')
            .get(isAuthenticated, controller.getCompanies)
            .post(isAuthenticated, controller.createCompany);

        this.router
            .route('/company/:id')
            .get(isAuthenticated, controller.getCompany)
            .put(isAuthenticated, controller.updateCompany)
            .delete(isAuthenticated, controller.deleteCompany);
    }
}