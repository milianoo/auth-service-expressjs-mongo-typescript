import * as mandrill from 'mandrill-api/mandrill';
import * as _ from 'lodash';
import {ICompany} from '../company/company.interface';
import {IUser} from '../users/user.interface';
import {ISurvey} from '../survey/survey.interface';
import {IQuestion} from '../survey/questions/questions.interface';

let mandrill_client = new mandrill.Mandrill('PNXkH2dFdBGpzDaRTKCsiw');

let extractQuestions = (questions, survey) => {

    let result = [];

    for (let i = 0; i < questions.length; i++) {

        let question = questions[i];
        let answerText = '';
        _.find(survey.answers, { questionId: question._id.toString() }).answers.map(answer => {
            answerText += question.answers[answer].text + ' ';
        });

        result[ i ] = {
            question_text: question.text,
            question_answer: answerText
        };

        if (i+1 == questions.length){
            return result;
        }
    }
};

export const sendSurveyCloseNotification = (company: ICompany, user: IUser, survey: ISurvey, questions: IQuestion[]) => {

    let summe = survey.limits.map((limit) => {
        return { value: limit };
    });
    let answers = extractQuestions(questions, survey);

    mandrill_client.messages.sendTemplate({
        template_name: "vsma_questionnaire_completed",
        template_content: [],
        message: {
            "from_email": "info@finlex.de",
            "from_name": "VDMA Cyber-Police TM (VCP)",
            "subject": "VCP: Neue Anfrage",
            "to": [
                { email: "sebastian.klapper@finlex.de", name: "Sebastian Klapper" },
                { email: "tim.buschlinger@finlex.de", name: "Tim Buschlinger" }
            ],
            "global_merge_vars": [
                { name: 'company_name', content: company.name },
                { name: 'company_revenue', content: company.revenue },
                { name: 'company_user', content: `${user.title} ${ user.lastName}` },
                { name: 'company_user_email', content: user.email },
                { name: 'summe_list', content: summe },
                { name: 'questions', content: answers }
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

