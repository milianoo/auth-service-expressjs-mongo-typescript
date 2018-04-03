import * as mandrill from 'mandrill-api/mandrill';

let mandrill_client = new mandrill.Mandrill('PNXkH2dFdBGpzDaRTKCsiw');

export const sendVerificationEmail = (code: string, email: string, fullName: string) => {

    let link = `http://localhost:4200/verify?activation=${code}&user=${email}`;

    mandrill_client.messages.sendTemplate({
        template_name: "vsma_account_verification",
        template_content: [],
        message: {
            "from_email": "info@finlex.de",
            "from_name": "VSMA Cyber Police",
            "subject": "VCP: Bitte bestätigen Sie Ihren Zugang",
            "to": [
                { email: email, name: fullName }
            ],
            "global_merge_vars": [
                { name: 'anrede_nachname', content: 'Herr ' + fullName },
                { name: 'verification_link', content: link }
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

