const controller = {
  cache: require('./cache/cache'),
};

/**
 * init controller
 *
 * @param {Function} getState application state
 * @param {object} config application config
 * @returns {object} controller
 */
const init = async (getState, config) => {
  for (const key of Object.keys(controller)) {
    controller[key] = await controller[key].init(getState, config);
  }
  return controller;
};

module.exports = { init };
