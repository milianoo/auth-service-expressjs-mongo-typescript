import {Logger, transports, LoggerOptions} from 'winston';
import 'winston-daily-rotate-file';
import * as appRoot from 'app-root-path';
import * as config from 'config';

const appName = config.get('appName');

const options: LoggerOptions = {
    file: {
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        filename: `${appRoot}/logs/${appName}-%DATE%.log`,
        datePattern: process.env.NODE_ENV === 'production' ? 'YYYY-MM-DD-HHmm' : 'YYYY-MM-DD',
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5
    },
    console: {
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        handleExceptions: true,
        silent: process.argv.indexOf('--silent') >= 0,
        json: false,
        colorize: true,
    },
    exitOnError: false,
};

const logger = new Logger({
    transports: [
        new transports.Console(options.console),
        new (transports.DailyRotateFile)(options.file)
    ],
    exitOnError: false, // do not exit on handled exceptions
});

if (process.env.NODE_ENV !== 'production') {
    logger.debug('logger initialized : debug');

} else {
    logger.info('logger initialized : info');
}

export default logger;