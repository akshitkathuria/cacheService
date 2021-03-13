const modules = {
  cache: require('./cache/cache'),
};

/**
 * init the seperate modules
 *
 * @param {Function} getState application state
 * @param {object} config application config
 * @returns {object} modules object
 */
const init = async (getState, config) => {
  for (const key of Object.keys(modules)) {
    modules[key] = await modules[key].init(getState, config);
  }
  return modules;
};

module.exports = { init };
