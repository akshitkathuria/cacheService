const genRandom = require('./genRandom');

const level = { DEBUG: 1, INFO: 2, WARN: 3, ERROR: 4, FATAL: 5 };
const revLevel = { 1: 'DEBUG', 2: 'INFO', 3: 'WARN', 4: 'ERROR', 5: 'FATAL' };
const service = 'cache';

/**
 * this function is used to log anything in the service
 *
 * @param {number} logLevel level of log
 * @param {string} type type
 * @param {string} logString log string
 * @param {object} options extra options
 */
const log = async (logLevel, type, logString, options = {}) => {
  const loggedAt = new Date().getTime();
  try {
    if (options.error) console.error(options.error);

    const loggedLevelName = revLevel[logLevel];
    console.info(`[${loggedAt}] [${service}] [${loggedLevelName}] [${type}] ${options.queryId ? `[${options.queryId}] `
      : `[${genRandom()}]`}${logString}`);
  } catch (err) { /**  */ }
};

module.exports = { level, log };
