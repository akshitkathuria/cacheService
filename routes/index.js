const routeModules = [];
routeModules.push(require('./cache'));

/**
 * init the routes
 *
 * @param {object} router express router
 * @param {Function} getState application state
 * @param {object} config application config
 */
module.exports.initRoutes = async (router, getState, config) => {
  for (const module of routeModules) await module.initRoutes(router, getState, config);
};
