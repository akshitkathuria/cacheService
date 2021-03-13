const services = {
  cache: require('./cache'),
};

/**
 * this function inits all the services
 *
 * @param {Function} getState application state
 * @param {object} config application config
 * @returns {object} service object
 */
const init = async (getState, config) => {
  for (const key of Object.keys(services)) {
    services[key] = await services[key].init(getState, config);
  }
  return services;
};

module.exports = { init };
