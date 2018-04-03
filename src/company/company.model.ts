import { Schema, Model, model} from "mongoose";
import {AddressSchema} from './address/address.schema';
import {ICompany, ICompanyModel} from './company.interface';

export const CompanySchema: Schema = new Schema({
    name: { type: String },
    domain: { type: String, lowercase: true, trim: true, required: true },
    email: { type: String, lowercase: true, trim: true },
    website: { type: String },
    address: { type: AddressSchema, default: { street: '', code:'', city:'' } },
    revenue: { type: String }
},{
    timestamps: true
});

export type CompanyModel = Model<ICompany> & ICompanyModel & ICompany;

export const Company: CompanyModel = <CompanyModel>model<ICompany>("Company", CompanySchema);
