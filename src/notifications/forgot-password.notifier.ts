import * as mandrill from 'mandrill-api/mandrill';

let mandrill_client = new mandrill.Mandrill('PNXkH2dFdBGpzDaRTKCsiw');

export const sendResetPasswordEmail = (redirect_url: string, code: string, email: string) => {

    let link = `${redirect_url}?code=${code}&user=${email}`;

    mandrill_client.messages.sendTemplate({
        template_name: "vsma_passwort_reset",
        template_content: [],
        message: {
            "from_email": "info@finlex.de",
            "from_name": "VDMA Cyber-Police TM (VCP)",
            "subject": "VCP: Bitte bestätigen Sie Ihren Zugang",
            "to": [
                { email: email }
            ],
            "global_merge_vars": [
                { name: 'password_reset_link', content: link }
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

