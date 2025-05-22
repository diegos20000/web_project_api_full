const winston = require('winston');
const expressWinston = require('express-winston');

const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.File({ filename: 'request.log' }),
  ],
  format: winston.format.combine(
    winston.format.json(),
    winston.format.printf(({ level, message, req }) => {
      const headers = req ? JSON.stringify(req.headers) : 'No headers';
      return `${level}: ${message} | Headers: ${headers} | Method: ${req ? req.method : 'unknown'} |
    URL: ${req ? req.url : 'unknown'}`;
    })
  ),
});

const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({ filename: 'error.log' }),
  ],
  format: winston.format.json(),
});
     
module.exports = {
  requestLogger,
  errorLogger,
};