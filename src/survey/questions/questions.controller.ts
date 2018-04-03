import * as lodash from 'lodash';
import {Request, Response} from 'express';
import { Question } from './questions.model';

export const createQuestion = (req: Request, res: Response) => {

    let question = new Question();

    question.order = req.body.order;
    question.category = req.body.category;
    question.text = req.body.text;
    question.description = req.body.description;
    question.relation = req.body.relation;
    question.answers = req.body.answers;
    question.type = req.body.type;

    question.validate()
        .then(() => {
            question.save()
                .then((_question) => {
                    res.status(201).send({ message: 'new question created.', data: _question });
                })
                .catch((err) => {
                    console.error(err);
                    res.status(400).send({ reason: 'BadRequest', message: 'failed to save the question.' });
                });
        })
        .catch(err => {
            console.error(err);
            return res.status(400).send({ reason: 'BadRequest', message: 'required fields are not set.' });
        })
};

export const getQuestions = (req: Request, res: Response) => {

    Question.find(req.query)
        .then((questions) => {
            res.send(questions);
        }).catch(err => {
            res.send({ reason: 'BadRequest', message: 'failed to get the questions.' });
        });
};

export const getQuestion = (req: Request, res: Response) => {

    if (!req.params || !req.params.id){
        return res.send({ reason: 'BadRequest', message: 'field "id" is required.' });
    }

    Question.findOne({ _id: req.params.id})
        .then((question) => {
            res.send(question);
        })
        .catch(err => {
            res.send({ reason: 'BadRequest', message: 'failed to get the question.' });
        });
};

export const updateQuestion = (req: Request, res: Response) => {

    if (!req.params || !req.params.id){
        return res.send({ reason: 'BadRequest', message: 'field "id" is required.' });
    }

    Question.findById( req.params.id)
        .then((question) => {

            let fields = Object.keys(req.body);
            lodash.forEach(fields, field => {
                question[ field ] = req.body[ field ];
            });

            question.save()
                .then(() => res.json(question))
                .catch((err) => {
                    console.log(err);
                    return res.send({ reason: 'BadRequest', message: 'failed to save the question.' });
                });
        });
};

export const deleteQuestion = (req: Request, res: Response) => {

    if (!req.params || !req.params.id){
        return res.send({ reason: 'BadRequest', message: 'field "id" is required.' });
    }

    // TODO : remove question's answers from survey answers

    Question.findByIdAndRemove(req.params.id, (err) => {
        if (err)
            res.send(err);

        res.json({ message: 'question removed.' });
    });

};