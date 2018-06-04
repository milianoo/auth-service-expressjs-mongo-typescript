import {ResponseErrorCode} from './responseCodes.enum';

class ResponseClass {

}

export class SuccessResponse extends ResponseClass {

    public data: any;

    constructor(
        data: any
    ) {
        super();

        this.data = data;
    }

}

export class ErrorResponse extends ResponseClass {

    public error: object;

    constructor(
        code: ResponseErrorCode,
        message: string
    ) {

        super();

        this.error =  {
            code: code,
            message: message
        };
    }
}