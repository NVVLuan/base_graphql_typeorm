import winston from 'winston';
import path from 'path';

export const Logger = winston.createLogger({
    // format của log được kết hợp thông qua format.combine
    format: winston.format.combine(
        winston.format.splat(),
        // Định dạng time cho log
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        // thêm màu sắc
        winston.format.colorize(),
        // thiết lập định dạng của log
        winston.format.printf((log) => {
            // nếu log là error hiển thị stack trace còn không hiển thị message của log
            if (log.stack) return `[${log.timestamp}] [${log.level}]: ${log.stack}`;
            return `[${log.timestamp}] [${log.level}]: ${log.message}`;
        })
    ),
    transports: [
        // hiển thị log thông qua console
        new winston.transports.Console({
            level: 'info',
        }),
        // Thiết lập ghi các errors vào file
        new winston.transports.File({
            level: 'error',
            filename: path.join(__dirname + '/logs/', 'errors.log'),
        }),
        new winston.transports.File({
            level: 'info',
            filename: path.join(__dirname + '/logs/', 'errors.log'),
        }),
    ],
});

export const LoggerInfo = (message: string) => {
    const str = '===========================================================================';
    return Logger.info(str.slice(0, (str.length - message.length) / 2) + message + str.slice(0, (str.length - message.length) / 2));
};

export const LoggerError = (message: string) => {
    const str = '===========================================================================';
    return Logger.error(str.slice(0, (str.length - message.length) / 2) + message + str.slice(0, (str.length - message.length) / 2));
};

