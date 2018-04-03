import * as mandrill from 'mandrill-api/mandrill';

let mandrill_client = new mandrill.Mandrill('PNXkH2dFdBGpzDaRTKCsiw');

export const sendVerificationEmail = (activationCode: string, email: string, name: string) => {

    let link = `http://localhost:4200/verify?activation=${activationCode}&user=${email}`;

    let message = {
        "html": `<p>Registered Successfully. please here verify your <a href="${link}">email</a>.</p>`,
        "text": "Example text content",
        "subject": "example subject",
        "from_email": "milad.rezazadeh@finlex.de",
        "from_name": "Survey | FINLEX",
        "to": [{
            "email": email,
            "name": name,
            "type": "to"
        }]
    };

    let async = false;
    let ip_pool = "Main Pool";
    let send_at = new Date();
    mandrill_client.messages.send({"message": message, "async": async, "ip_pool": ip_pool, "send_at": send_at}, function(result) {
        console.log(result);
        /*
        [{
                "email": "recipient.email@example.com",
                "status": "sent",
                "reject_reason": "hard-bounce",
                "_id": "abc123abc123abc123abc123abc123"
            }]
        */
    }, function(e) {
        // Mandrill returns the error as an object with name and message keys
        console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
        // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
    });

};

