import * as express from 'express';
import * as questionsController from './questions.controller';
import {isAuthenticated} from '../../auth/auth.controller';

export class QuestionsRouter {

    public router;

    constructor() {
        this.router = express.Router();

        this.router
            .route('/survey/questions/:id')
            .get(isAuthenticated, questionsController.getQuestion)
            .put(isAuthenticated, questionsController.updateQuestion)
            .delete(isAuthenticated, questionsController.deleteQuestion);

        this.router
            .route('/survey/questions')
            .post(isAuthenticated, questionsController.createQuestion)
            .get(isAuthenticated, questionsController.getQuestions);

    }
}