
import * as lodash from 'lodash';
import { Request, Response, NextFunction } from 'express';
import {Company, CompanyModel} from './company.model';
import {sendCompanyInfoNotification} from '../notifications/notifiers/company-info.notifier';
import {IUser} from '../users/user.interface';

export const getCompany = (req: Request, res: Response, next: NextFunction) => {

    if (!req.params || !req.params.id){
        return next({ reason: 'BadRequest', message: 'field "id" is required.' });
    }

    Company.findOne({ _id: req.params.id})
        .then((company) => {
            if (company){
                res.status(200).send(company);
            }else{
                res.status(404).send({});
            }
        })
        .catch(err => res.send({ reason: 'BadRequest', message: 'failed to get the company.' }));
};

export const getCompanies = (req: Request, res: Response) => {

    Company.find(req.query)
        .then((companies) => res.send(companies))
        .catch(err => res.send({ reason: 'BadRequest', message: 'failed to get the companies.' }));
};

export const createCompany = (req: Request, res: Response) => {

    let company = new Company();

    let fields = Object.keys(req.body);
    lodash.forEach(fields, field => {
        company[ field ] = req.body[ field ];
    });

    company.validate()
        .then(() => {

            company.save()
                .then(() => {

                    res.status(201).send({ message: 'new company created.', data: company });
                })
                .catch((err) => {
                    console.error(err);
                    res.status(400).send({ reason: 'BadRequest', message: 'failed to save the company.' });
                });
        })
        .catch(err => {
            return res.status(400).send({ reason: 'BadRequest', message: 'required fields are not set.' });
        });
};

export const updateCompany = (req: Request, res: Response, next: NextFunction) => {

    if (!req.params || !req.params.id){
        return res.send({ reason: 'BadRequest', message: 'field "id" is required.' });
    }

    Company.findById( req.params.id,  (err, company: CompanyModel) => {
        if (err){
            next(err);
        }

        let fields = Object.keys(req.body);
        lodash.forEach(fields, field => {
            company[ field ] = req.body[ field ];
        });

        company.save()
            .then(() => {
                console.log(`company ${company.id} updated.`);

                if (company.isProfileCompleted()) {
                    console.log(`sending company ${company.id} info notifications.`);
                    sendCompanyInfoNotification('milad.rezazadeh@finlex.de', 'Milad Rezazadeh', company, <IUser>req.user);
                }

                res.json(company);
            })
            .catch((err) => {
                console.log(err);
                return res.send({ reason: 'BadRequest', message: 'failed to save the company.' });
            });
    });

};

export const deleteCompany = (req: Request, res: Response, next: NextFunction) => {

    if (!req.params || !req.params.id){
        return res.send({ reason: 'BadRequest', message: 'field "id" is required.' });
    }

    Company.findByIdAndRemove(req.params.id, (err) => {
        if (err)
            res.send(err);

        res.json({ message: 'company removed!' });
    });

};