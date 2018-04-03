import {Document} from "mongoose";

export interface ICategory extends Document {

    order: number;

    name: string;
}

export interface ICategoryModel {

}