import {Model, model, Schema} from "mongoose";
import {ISurvey, ISurveysModel} from './survey.interface';
import {SurveyAnswerSchema} from './answer/answer.schema';

export const SurveysSchema: Schema = new Schema({
    company: { type: Schema.Types.ObjectId, required: true, ref: 'Company' },
    domain: { type: String, required: true },
    answers: { type: [ SurveyAnswerSchema ], default: [] },
    answered_count: { type: Number, default: 0 },
    termsAndConditions: { type: Boolean, required: true, default: false },
    closed: { type: Boolean, default: false },
    sent: { type: Boolean, default: false },
    limits: { type: Array, default: [] }
},{
    timestamps: true
});

SurveysSchema.pre('save', function(next) {

    let survey = this;
    survey.answered_count = survey.answers.length;

    next();
});

export type SurveysModel = Model<ISurvey> & ISurveysModel & ISurvey;

export const Survey: SurveysModel = <SurveysModel>model<ISurvey>("Surveys", SurveysSchema);