import {Document} from "mongoose";
import {ICompany} from '../company/company.interface';

export interface ISurvey extends Document {

    company: string | ICompany,

    domain: string,

    answers: Array<any>,

    completed: boolean,

    closed: boolean,

    sent: boolean,

    limits: Array<string>
}

export interface ISurveysModel {

}