import {Schema} from "mongoose";

export const AnswerSchema : Schema = new Schema({
    responderId: { type: String, required: true },
    questionId: { type: String },
    answers: { type: [Number] }
});