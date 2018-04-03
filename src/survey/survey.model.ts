import {Model, model, Schema} from "mongoose";
import {ISurveys, ISurveysModel} from './survey.interface';
import {AnswerSchema} from './answer/answer.schema';

export const SurveysSchema: Schema = new Schema({
    owner: { type: String, required: true },
    domain: { type: String, required: true },
    answers: { type: [ AnswerSchema ], default: [] },
    answered_count: { type: Number, default: 0 },
    closed: { type: Boolean, default: false }
},{
    timestamps: true
});

SurveysSchema.pre('save', function(next) {

    let survey = this;
    survey.answered_count = survey.answers.length;
    next();
});

export type SurveysModel = Model<ISurveys> & ISurveysModel & ISurveys;

export const Survey: SurveysModel = <SurveysModel>model<ISurveys>("Surveys", SurveysSchema);