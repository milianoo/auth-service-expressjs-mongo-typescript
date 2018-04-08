import * as sql from 'mssql';
import * as _ from 'lodash';
import {Observable} from 'rxjs';
import {Question} from '../survey/questions/questions.model';
import {QuestionType} from '../survey/questions/questions.enum';
import {UserType} from '../users/user.types';

let config = {
    user: 'sa',
    password: 'U!T?VzeS2APj89QZ',
    server: '94.130.77.2',
    port: '49854',
    database: 'VSMATest'
};

let populateAnswers = (survey, questions) => {

    return Observable.create((observer) => {

        let allRefs = {};
        for (let i = 0; i < survey.answers.length; i++){
            let surveyAnswer = survey.answers[i];
            let question = _.filter(questions, (q) => {

                return q._id.toString() === surveyAnswer.questionId.toString();
            });

            _.each(_.first(question).answers, answer => {
                allRefs[ answer.ref ] = surveyAnswer.answers.indexOf(answer.order) >= 0 ? 1 : 0;
            });

            if ( i +1 == survey.answers.length){
                observer.next(allRefs);
            }
        }
    });
};
let createCustomer = (survey) => {
    console.info('creating customer account...');
    return Observable.create((observer) => {
        let request = new sql.Request();

        let customer_query = "INSERT INTO tbl_sc_kunde (Makler_ID, Firma_ID, FirmaName, Strasse, PLZOrt, Webseite, Umsatz, Branche_ID, ShowFragebogen, ShowVorschlag, ShowAntrag) " +
            `VALUES (1, 1, '${survey.company.name}', '${survey.company.address.street}', '${survey.company.address.code} ${survey.company.address.city}', '${survey.company.website}', '${survey.company.revenue}', 1, 1, 1, 1); 
             select * from tbl_sc_kunde where FirmaName = '${survey.company.name}'`;

        request.query(customer_query, (err, result) => {
            if (err) {
                console.log(err);
                observer.error(err);
            }

            let customerId = result.recordset[0].ID;
            console.log(`new customer inserted to vsma : ${customerId}`);

            let angbot_anterag_query = "INSERT INTO tbl_sc_kunde (Makler_ID, Firma_ID, FirmaName, Strasse, PLZOrt, Webseite, Umsatz, Branche_ID, ShowFragebogen, ShowVorschlag, ShowAntrag) " +
            `VALUES (1, 1, '${survey.company.name}', '${survey.company.address.street}', '${survey.company.address.code} ${survey.company.address.city}', '${survey.company.website}', '${survey.company.revenue}', 1, 1, 1, 1); 
             select * from tbl_sc_kunde where FirmaName = '${survey.company.name}'`;
            request.query(customer_query, (err, result) => {
                if (err) {
                    console.log(err);
                    observer.error(err);
                }

                observer.next(customerId);
            });
        })
    });
};

export const importQuestions = () => {

    return Observable.create((observer) => {

        sql.connect(config, function (err) {
            if (err) {
                console.error(err);
                observer.error(false);
            }

            console.log('importing questions...');

            let request = new sql.Request();
            request.query('select * from tbl_sc_fragebogen', function (err, result) {

                if (err) {
                    console.log(err);
                    observer.error(false);
                }

                let questions = [];
                let question;
                result.recordset.forEach(record => {

                    if (record.Gruppe) {
                        question = {};
                        question.category = 1;
                        question.text = record.Gruppe;
                        question.type = QuestionType.SingleChoice;
                        question.order = questions.length;
                        question.answers = [];
                        question.answers.push({
                            order: 0,
                            text: record.Antwort,
                            ref: record.QuestionIdentifier
                        });

                        questions.push({...question});
                    }else {
                        let item = _.last(questions);
                        item.answers.push({
                            order: item.answers.length,
                            text: record.Antwort,
                            ref: record.QuestionIdentifier
                        })
                    }
                });

                questions.forEach(q => {

                    let question = new Question();
                    question.order = q.order;
                    question.category = q.category;
                    question.text = q.text;
                    question.type = q.type;
                    question.relation = 0;
                    q.answers.forEach(a =>{
                        question.answers.push(a);
                    });

                    question.validate()
                        .then(() => question.save().then(() => console.log(question.order + ' imported.')))
                        .catch((err) => {
                            console.error(question.order + ' not imported' + err.message)
                        });
                });

                sql.close();

                observer.next(true);
            });
        });

    });

};

export const createCustomerAccount = (survey: any, questions: any[]) => {

    sql.connect(config, function (err) {
        if(err) {
            console.log('failed to connect to sql server', err);
        }

        createCustomer(survey).subscribe(
            (customerId) => {

                if (customerId) {
                    populateAnswers(survey, questions, ).subscribe((answers) =>{

                        let fields = Object.keys(answers);
                        let values = [];
                        Object.keys(answers).forEach(k => {
                            values.push(answers[k]);
                        });

                        let answer_query = `INSERT INTO tbl_sc_kundenfragebogen 
                            (Kunde_ID, ${fields} )
                        VALUES (${customerId}, ${values}); select * from tbl_sc_kundenfragebogen where Kunde_ID = '${customerId}'`;

                        let request = new sql.Request();
                        request.query(answer_query, (err, result) => {

                            console.log(result);
                        });

                    });

                }else {
                    console.error('failed to create customer.');
                }
            }
        );
    });

};



