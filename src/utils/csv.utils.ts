
const Json2csvParser = require('json2csv').Parser;

export const convertArrayToCsv = (array: Array<any>, fields: Array<any>) => {

    const json2csvParser = new Json2csvParser({ fields });
    return json2csvParser.parse(array);
};