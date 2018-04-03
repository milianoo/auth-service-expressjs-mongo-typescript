import {Document} from "mongoose";

export interface IQuestion extends Document {

    order: number;

    category: number;

    text?: string;

    description: string;

    type?: number;

    relation?: string;

    answers?: Array<string>
}

export interface IQuestionModel {

}