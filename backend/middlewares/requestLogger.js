const morgan = require('morgan');
const logger = require('../utils/logger');

// wrap morgan stream to use winston
const stream = {
  write: (message) => logger.info(message.trim()),
};

// skip logging during tests
const skip = () => process.env.NODE_ENV === 'test';

module.exports = morgan('combined', { stream, skip });