import {Model, model, Schema} from "mongoose";
import {ICategory, ICategoryModel} from './category.interface';

export const CategorySchema: Schema = new Schema({
    order:  { type: Number, required: true },
    name: { type: String, required: true }
},{
    timestamps: true
});

export type CategoryModel = Model<ICategory> & ICategoryModel & ICategory;

export const Category: CategoryModel = <CategoryModel>model<ICategory>("Category", CategorySchema);