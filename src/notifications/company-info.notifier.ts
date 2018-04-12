import * as mandrill from 'mandrill-api/mandrill';
import {ICompany} from '../company/company.interface';
import {IUser} from '../users/user.interface';

let mandrill_client = new mandrill.Mandrill('PNXkH2dFdBGpzDaRTKCsiw');

export const sendCompanyInfoNotification = (email: string, fullName: string, company: ICompany, user: IUser) => {

    mandrill_client.messages.sendTemplate({
        template_name: "vsma_information_company_info_updated",
        template_content: [],
        message: {
            "from_email": "info@finlex.de",
            "from_name": "VDMA Cyber-Police TM (VCP)",
            "subject": "VCP: Bitte bestätigen Sie Ihren Zugang",
            "to": [
                { email: "sebastian.klapper@finlex.de", name: "Sebastian Klapper" },
                { email: "tim.buschlinger@finlex.de", name: "Tim Buschlinger" }
            ],
            "global_merge_vars": [
                { name: 'company_name', content: company.name },
                { name: 'company_website', content: company.website },
                { name: 'company_revenue', content: company.revenue },
                { name: 'company_user', content: `${user.title} ${ user.lastName}` },
                { name: 'company_user_email', content: user.email }
            ]
        }
    }, function( error, response ) {
        if ( error ) {
            console.log( error );
        } else {
            console.log( response );
        }
    });

};

