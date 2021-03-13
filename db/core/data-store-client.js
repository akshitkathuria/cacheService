const Mongodb = require('./db-wrappers/mongodb');

class DataStoreClient {
  /**
   * constructor function
   *
   * @param {object} options mongodb options
   * @param {object} utils utility object
   */
  constructor(options, utils) {
    this.utils = utils;
    if ('url' in options && 'database' in options && options.url && options.database) {
      this.options = {};
      this.options.url = options.url;
      this.options.database = options.database;
    } else {
      const errMsg = '*** mongodb: url or database not set in data store constructor, data will not be saved ***';
      utils.logging.log(utils.logging.level.ERROR, 'dbError', errMsg, { queryId: utils.genRandom() });
    }
  }

  /**
   * Etablish connection with database
   *
   * @param {object} options mongodb options
   * @returns {object} db instance
   */
  connect(options) {
    this.dbInstance = null;
    this.dbInstance = new Mongodb(this.options.url, this.options.database, this.utils);
    return this.dbInstance.connect(options);
  }

  /**
   * insert data in db
   *
   * @param {object} data insert data in db
   * @param {*} returnId is true then return inseerted id
   * @returns {boolean} true
   */
  insert(data, returnId = false) {
    if (!this.dbInstance) {
      throw new Error('No database connnected.');
    }
    return this.dbInstance.insert(data, returnId);
  }

  /**
   * find in db
   *
   * @param {object} query find query
   * @param {number} limit limit query
   * @returns {Array} array of find result
   */
  find(query, limit = 0) {
    if (!this.dbInstance) {
      throw new Error('No database connnected.');
    }
    return this.dbInstance.find(query, limit);
  }

  /**
   * remove record from db
   *
   * @param {object} query find query
   * @returns {boolean} true
   */
  remove(query) {
    if (!this.dbInstance) {
      throw new Error('No database connnected.');
    }
    return this.dbInstance.remove(query, true);
  }

  /**
   * count records in db
   *
   * @param {object} query find query
   * @returns {number} count number
   */
  count(query) {
    if (!this.dbInstance) {
      throw new Error('No database connnected.');
    }
    return this.dbInstance.count(query);
  }

  /**
   * update value in db
   *
   * @param {object} query find query
   * @param {object} updates update object
   * @returns {boolean} true
   */
  update(query, updates) {
    if (!this.dbInstance) {
      throw new Error('No database connnected.');
    }
    return this.dbInstance.update(query, updates);
  }
}

module.exports = {
  DataStoreClient,
};
