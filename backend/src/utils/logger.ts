import winston, { format, transports } from 'winston';

const logFormat = format.combine(
    format.timestamp({format: 'HH-MM:ss YYYY-MM-DD' }),
    format.prettyPrint(),
    format.colorize(),
    format.align(),
    format.printf(info => {
        return `[${info.timestamp}] [${info.level}] ${info.message}`;
      })
);

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: logFormat,
    transports: [new (winston.transports.Console)()],
});

const reqLogger = {
    info: (reqId: String, msg: String) => {
        logger.info(`[Request ID: ${reqId}] ${msg}`);
    },
    error: (reqId: String, msg: String) => {
        logger.error(`[Request ID: ${reqId}] ${msg}`);
    },
    warn: (reqId: String, msg: String) => {
        logger.warn(`[Request ID: ${reqId}] ${msg}`);
    },
};

export {
    logger, 
    reqLogger
};
