import {Document} from "mongoose";

export interface ISurveys extends Document {

    owner: string,

    domain: string,

    answers: Array<number>,

    completed: boolean

    closed: boolean
}

export interface ISurveysModel {

}