const appIndex = require('./app/index');
const routeIndex = require('./routes/index');
const controllers = require('./controllers/index');
const services = require('./services/index');
const modules = require('./modules/index');
const utils = require('./utils/index');
const config = require('./config/config.json');

const state = {};

/**
 * main function
 */
const main = async () => {
  /**
   * state object wrapper function
   *
   * @returns {object} application state
   */

  const env = process.env.ENV || 'local';
  const getState = () => state;
  state.rootDir = __dirname;
  state.utils = utils;
  state.db = {
    cache: await appIndex.initDB(config.MONGO_URL[env], 'cache', utils),
  };

  state.services = await services.init(getState, config);
  state.modules = await modules.init(getState, config);
  state.controllers = await controllers.init(getState, config);

  const app = await appIndex.initExpress(utils, config);
  const router = await appIndex.initRouter(app);
  await routeIndex.initRoutes(router, getState, config);
};

main();
