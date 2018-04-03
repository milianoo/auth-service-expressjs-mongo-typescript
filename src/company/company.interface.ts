import {Document} from "mongoose";

export interface ICompany extends Document {

    name?: string;

    email?: string;

    address?: object;

    website?: string;

    revenue?: string;
}

export interface ICompanyModel {

}
