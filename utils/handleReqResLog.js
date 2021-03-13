const logging = require('./logging');
const genRandom = require('./genRandom');

/**
 * this function handles the request and response log
 *
 * @param {object} req express api request object
 * @param {object} res express api response object
 * @param {object} next next callback
 */
module.exports = (req, res, next) => {
  const routerIdentifier = `/${req.path.split('/')[1]}`;
  let requestAt = req.path.replace(routerIdentifier, '').replace(/\//g, '.');

  if (requestAt.charAt(requestAt.length - 1) === '.') {
    requestAt = requestAt.slice(0, requestAt.length - 1);
  }

  const queryId = req.query.queryId ? req.query.queryId : genRandom();
  req.query.queryId = queryId;

  /* This handler supports res.status().send/json, res.send/json. And does not handle res.sendStatus, yet. */
  const tempSendResponder = res.send;
  /**
   * this function overrides the express res.send to log req and res
   *
   * @param  {...any} args any args
   */
  res.send = function overridenSendResponder(...args) {
    if (args[0] === null || typeof args[0] !== 'object') {
      setImmediate(() => {
        const responseObject = {};
        logging.log(logging.level.DEBUG, `req${requestAt}`, `of type ${req.method} Received`, { queryId });

        if (req.timedout) {
          /* This is to override the incoming response that would have been sent, in
                      case the request wouldn't have been timedout */
          responseObject.timedout = true;
        } else {
          responseObject.code = res.statusCode;
        }
        if (args[0] === null || args[0]) {
          [responseObject.body] = args;
          try {
            if (typeof responseObject.body === 'string') {
              responseObject.body = JSON.parse(responseObject.body);
            }
          } catch (_) { /**/ }
        }
        logging.log(logging.level.DEBUG,
          `res${requestAt}`, JSON.stringify(responseObject), { queryId });
      });
    }
    try { tempSendResponder.apply(this, args); } catch (_) { /**/ }
  };
  next();
};
