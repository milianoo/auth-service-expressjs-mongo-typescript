import * as _ from 'lodash';
import {Request, Response} from 'express';
import {Survey} from './survey.model';
import {createCustomerAccount} from '../vsma-connector/vsma.controller';
import {Question} from './questions/questions.model';
import {sendSurveyCloseNotification} from '../notifications/survey-close.notifier';
import {IUser} from '../users/user.interface';
import {ICompany} from '../company/company.interface';

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
            console.error(err);
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
            console.error(err);
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
                        console.error(err);
                        res.send({ reason: 'BadRequest',
                            message: 'failed to save the survey.',
                            stack: err
                        });
                    }
                );

            })
            .catch(err => {
                console.error(err);
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
                .then((survey) => {

                    if (survey) {

                        createCustomerAccount(survey, questions).subscribe(() => {

                            sendSurveyCloseNotification(<ICompany>survey.company, <IUser>req.user, survey, questions);

                            console.log('closing survey...');

                            survey.closed = true;
                            survey.sent = true;

                            survey.limits = req.body.summe;

                            survey.save()
                                .then(() => res.status(200).send({ message: 'survey closed successfully.' }))
                                .catch((err) => {
                                    console.error('failed to save the survey.', err);
                                    res.status(200).send({ message: 'failed to save the survey.' })
                                });

                        });
                    }
                    else{
                        console.error(`survey ${req.params.id} not found.`);
                        res.status(404).send({ reason: 'NotFound', message: 'failed to get the survey.' });
                    }
                })
                .catch((err) => {
                    console.error(err);
                    res.send({ reason: 'BadRequest', message: 'failed to get the survey.' });
                });

        });


};