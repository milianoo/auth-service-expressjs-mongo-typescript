import {Schema} from "mongoose";

export const QuestionAnswerSchema : Schema = new Schema({
    order: { type: Number, required: true },
    text: { type: String, required: true  },
    ref: { type: String  }
});

export const SurveyAnswerSchema : Schema = new Schema({
    responderId: { type: String, required: true },
    questionId: { type: String, required: true },
    answers: { type: [Number] }
});