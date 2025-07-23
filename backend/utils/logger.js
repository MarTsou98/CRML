const { createLogger, format, transports } = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');

const dailyRotateTransport = new DailyRotateFile({
  filename: 'logs/%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: false,               // Set to true if you want logs to be zipped
  maxSize: '40m',
 
});

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(({ timestamp, level, message, ...meta }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}${
        Object.keys(meta).length ? '\n' + JSON.stringify(meta, null, 2) : ''
      }`;
    })
  ),
  transports: [
    new transports.Console(),
    dailyRotateTransport
  ],
});

module.exports = logger;
