import * as mandrill from 'mandrill-api/mandrill';
import * as config from 'config';

let mandrill_client = new mandrill.Mandrill(config.get('mandrill_key'));

export const sendVerificationEmail = (redirect_url: string, code: string, email: string, fullName: string) => {

    let link = `${redirect_url}?activation=${code}&user=${email}`;

    mandrill_client.messages.sendTemplate({
        template_name: "vsma_account_verification",
        template_content: [],
        message: {
            "from_email": "info@finlex.de",
            "from_name": "VDMA Cyber-Police TM (VCP)",
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

