const express = require('express');
const connectTimeout = require('connect-timeout');
const { DataStoreClient } = require('../db/index');

/**
 * this function init the express app
 *
 * @param {object} utils utility object
 * @param {object} PORT port to run app on
 * @param {number} PORT.PORT destructuring the port out of config
 * @returns {object} express app
 */
const initExpress = async (utils, { PORT }) => {
  const { logging } = utils;
  const queryId = utils.genRandom();

  const app = express();
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json({ limit: '50mb' }));
  app.use(connectTimeout('30s'));

  app.use(utils.handleReqResLog);

  app.listen(PORT, () => logging.log(logging.level.INFO, 'initExpress', `app listening at port ${PORT}`, { queryId }));
  return app;
};

/**
 * this function creates a express router and add properties to it
 *
 * @param {object} app express app
 * @returns {object} express router
 */
const initRouter = async (app) => {
  const router = express.Router();
  app.use('/cache', router);
  app.all('*', (req, res) => res.status(404).json({ status: 'error', message: 'not implemented' }));
  return router;
};

/**
 * this function intialize the db
 *
 * @param {string} mongoUrl mongo url
 * @param {string} dbName collection name
 * @param {object} utils utility object
 * @returns {object} mongo db instance
 */
const initDB = async (mongoUrl, dbName, utils) => {
  const db = new DataStoreClient({ url: mongoUrl, database: dbName }, utils);
  await db.connect();
  return db;
};

module.exports = { initExpress, initRouter, initDB };
