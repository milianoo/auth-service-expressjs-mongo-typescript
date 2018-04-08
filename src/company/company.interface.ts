import {Document} from "mongoose";

export interface ICompany extends Document {

    name?: string;

    email?: string;

    address?: {
        street: string;
        city: string;
        code: string;
    };

    website?: string;

    revenue?: string;

    company: string | ICompany;
}

export interface ICompanyModel {
    isProfileCompleted(): boolean;
}
