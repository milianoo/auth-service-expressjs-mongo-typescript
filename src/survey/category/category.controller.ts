import {Request, Response} from 'express';
import {Category} from './category.model';

export const getQuestionCategory = (req: Request, res: Response) => {

    Category.find({})
        .sort('order')
        .then((categories) => res.send(categories))
        .catch((err) => res.send({ reason: 'BadRequest', message: err.message + ' ttt  failed to get the categories.', err: err }));
};

export const createQuestionCategory = (req: Request, res: Response) => {

    let category = new Category();

    category.order = req.body.order;
    category.name = req.body.name;

    category.validate()
        .then(() => {
            category.save()
                .then((_category) => res.status(201).send({ message: 'new category created.', data: _category }))
                .catch(() => res.status(400).send({ reason: 'BadRequest', message: 'failed to save the category.' }))
        })
        .catch(() => res.status(400).send({ reason: 'BadRequest', message: 'required fields are not set.' }));
};

export const deleteQuestionCategory = (req: Request, res: Response) => {

    if (!req.params || !req.params.id){
        return res.send({ reason: 'BadRequest', message: 'field "id" is required.' });
    }

    Category.findByIdAndRemove(req.params.id, (err) => {
        if (err)
            res.send(err);

        res.json({ message: 'category removed.' });
    });
};