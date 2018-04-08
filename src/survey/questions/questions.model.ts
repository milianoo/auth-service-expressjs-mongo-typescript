import {Model, model, Schema} from "mongoose";
import {IQuestion, IQuestionModel} from './questions.interface';
import {QuestionAnswerSchema} from '../answer/answer.schema';

export const QuestionSchema: Schema = new Schema({
    order:  { type: Number, required: true },
    category:  { type: Number, required: true },
    text: { type: String, required: true, default: '' },
    description: { type: String, required: false, default: '' },
    answers: { type: [ QuestionAnswerSchema ], default: [] },
    type: { type: String, required: true },
    relation: { type: Number, required: true }
},{
    timestamps: true
});

export type QuestionsModel = Model<IQuestion> & IQuestionModel & IQuestion;

export const Question: QuestionsModel = <QuestionsModel>model<IQuestion>("Question", QuestionSchema);