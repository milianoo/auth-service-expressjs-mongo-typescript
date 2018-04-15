import * as _ from 'lodash';
import * as debug from 'debug';
import {Request, Response} from 'express';
import {Survey, SurveysModel} from './survey.model';
import {exportDataToMsSql} from '../vsma-connector/vsma.controller';
import {Question} from './questions/questions.model';
import {sendSurveyCloseNotification} from '../notifications/notifiers/survey-close.notifier';
import {IUser} from '../users/user.interface';
import {ICompany} from '../company/company.interface';

const log = debug('api:survey');
const error = debug('api:error');

export const createSurvey = (req: Request, res: Response) => {

    if (!req.user || !req.user.email) {
        res.status(400).send({ reason: 'BadRequest', message: 'failed to create survey.' });
        return;
    }

    let survey = new Survey();

    let userDomain = req.user.email.split('@')[1];

    survey.company = req.user.companyId;
    survey.domain = userDomain;

    survey.save()
        .then(_survey => res.status(201).send({ message: 'new survey created.', data: _survey }))
        .catch((err) => {
            error(err);
            res.status(400).send({ reason: 'BadRequest', message: 'failed to create survey.' });
        });
};

export const getSurvey = (req: Request, res: Response) => {

    if (!req.params || !req.params.id) {
        return res.send({ reason: 'BadRequest', message: 'field "id" is required.' });
    }

    Survey.findOne({ _id: req.params.id})
        .then((question) => {
            res.send(question);
        })
        .catch(err => {
            res.send({ reason: 'BadRequest', message: 'failed to get the survey.' });
        });
};

export const findUsersSurvey = (req: Request, res: Response) => {

    let userDomain = req.user.email.split('@')[1];

    Survey.findOne({ domain: userDomain })
        .then((survey) => res.send(survey))
        .catch(err => {
            error(err);
            res.send({ reason: 'BadRequest', message: 'failed to get the survey.' });
        });
};

export const getSurveysStatistics = (req: Request, res: Response) => {

    Survey.find({})
        .populate('company')
        .select("-answers")
        .exec()

        .then(data => res.send(data));

};

export const updateAnswer = (req: Request, res: Response) => {

    let surveyId = req.params.id;
    let questionId = req.params.questionId;
    let answers = req.body.answers;

    if (surveyId) {

        Survey.findOne({ _id: surveyId })
            .then((survey) => {
                let questionAnswer = _.find(survey.answers, { questionId: questionId });
                if (!questionAnswer) {
                    questionAnswer = {
                        questionId: questionId,
                        responderId: req.user._id,
                        answers: answers
                    };
                    survey.answers.push(questionAnswer);
                }else{
                    questionAnswer.answers = answers;
                    questionAnswer.responderId = req.user._id;
                }

                survey.save().then(
                    () => res.status(200).send(survey),
                    (err) => {
                        error(err);
                        res.send({ reason: 'BadRequest',
                            message: 'failed to save the survey.',
                            stack: err
                        });
                    }
                );

            })
            .catch(err => {
                error(err);
                res.send({ reason: 'BadRequest', message: 'failed to get the survey.' });
            });
    }
};

export const closeAndSend = (req: Request, res: Response) => {

    if (!req.params || !req.params.id) {
        return res.send({ reason: 'BadRequest', message: 'field "id" is required.' });
    }
    let questions: any[];
    Question.find({})
        .sort('order')
        .then((data => questions = data))

        .then(() => {

            Survey.findOne({ _id: req.params.id })
                .populate('company')
                .exec()
                .then((survey: SurveysModel) => {

                    if (survey) {

                        log(`exporting data to ms sql for survey ${survey._id}`);

                        exportDataToMsSql(survey, questions).subscribe(() => {

                            log(`closing survey ${survey._id}`);

                            survey.sent = true;
                            survey.closed = true;
                            survey.termsAndConditions = req.body.termsAndConditions;
                            survey.limits = req.body.limits;

                            survey.save()
                                .then(() => {

                                    log(`send survey notification ${survey._id}`);
                                    sendSurveyCloseNotification(<ICompany>survey.company, <IUser>req.user, survey, questions);

                                    res.status(200).send({ message: 'survey closed successfully.' });
                                })
                                .catch((err) => {
                                    error('failed to save the survey.', err);
                                    res.status(200).send({ message: 'failed to save the survey.' })
                                });

                        });
                    }
                    else{
                        error(`survey ${req.params.id} not found.`);
                        res.status(404).send({ reason: 'NotFound', message: 'failed to get the survey.' });
                    }
                })
                .catch((err) => {
                    error(err);
                    res.send({ reason: 'BadRequest', message: 'failed to get the survey.' });
                });

        });


};