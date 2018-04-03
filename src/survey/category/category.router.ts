import * as express from 'express';
import * as categoryController from './category.controller';
import {isAuthenticated} from '../../auth/auth.controller';

export class CategoryRouter {

    public router;

    constructor() {
        this.router = express.Router();

        this.router
            .route('/survey/categories/:id')
            .delete(isAuthenticated, categoryController.deleteQuestionCategory);

        this.router
            .route('/survey/categories')
            .get(isAuthenticated, categoryController.getQuestionCategory)
            .post(isAuthenticated, categoryController.createQuestionCategory);
    }
}