import * as express from 'express';
import * as controller from './survey.controller';
import {isAuthenticated} from '../auth/auth.controller';

export class SurveyRouter {

    public router;

    constructor() {
        this.router = express.Router();

        this.router
            .route('/survey/stat')
            .get(isAuthenticated, controller.getSurveysStatistics);

        this.router
            .route('/survey/:id/question/:questionId/answer/')
            .post(isAuthenticated, controller.updateAnswer);

        this.router
            .route('/survey/:id/close')
            .post(isAuthenticated, controller.closeAndSend);

        this.router
            .route('/survey/:id')
            .get(isAuthenticated, controller.getSurvey);

        this.router
            .route('/survey')
            .get(isAuthenticated, controller.findUsersSurvey)
            .post(isAuthenticated, controller.createSurvey);

    }
}