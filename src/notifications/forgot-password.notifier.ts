import * as mandrill from 'mandrill-api/mandrill';

let mandrill_client = new mandrill.Mandrill('PNXkH2dFdBGpzDaRTKCsiw');

export const sendResetPasswordEmail = (code: string, email: string) => {

    // let message = {
    //     "html": `<p>Reset Password. please <a href="${link}">reset your password here</a>.</p>`,
    //     "text": "Password recovery",
    //     "subject": "Reset Password",
    //     "from_email": "milad.rezazadeh@finlex.de",
    //     "from_name": "Survey | FINLEX",
    //     "to": [{
    //         "email": email,
    //         "name": name,
    //         "type": "to"
    //     }]
    // };
    //
    // let async = false;
    // let ip_pool = "Main Pool";
    // let send_at = new Date();
    // mandrill_client.messages.send({"message": message, "async": async, "ip_pool": ip_pool, "send_at": send_at}, function(result) {
    //     console.log(result);
    //     /*
    //     [{
    //             "email": "recipient.email@example.com",
    //             "status": "sent",
    //             "reject_reason": "hard-bounce",
    //             "_id": "abc123abc123abc123abc123abc123"
    //         }]
    //     */
    // }, function(e) {
    //     // Mandrill returns the error as an object with name and message keys
    //     console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
    //     // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
    // });

    let link = `http://localhost:4200/password-reset?code=${code}&user=${email}`;

    mandrill_client.messages.sendTemplate({
        template_name: "vsma_passwort_reset",
        template_content: [],
        message: {
            "from_email": "info@finlex.de",
            "from_name": "VSMA Cyber Police",
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

