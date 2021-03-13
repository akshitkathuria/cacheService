const { MongoClient } = require('mongodb');

class MongoDb {
  /**
   * constructor function
   *
   * @param {string} url mongo url
   * @param {string} database database name
   * @param {object} utils utility
   */
  constructor(url, database, utils) {
    this.url = url;
    this.database = database;
    this.db = {};
    this.collection = {};
    this.utils = utils;
  }

  /**
   * connect function
   *
   * @returns {Promise} resolve to return true
   */
  connect() {
    this.db = {};
    this.collection = {};
    return new Promise((res, rej) => {
      MongoClient.connect(this.url, { useUnifiedTopology: true }, async (err, client) => {
        if (err) rej(err);
        else {
          this.db = client.db(this.database);
          this.collection = this.db.collection('documents');
          this.utils.logging.log(this.utils.logging.level.INFO,
            'mongodb', 'connected to mongodb', { queryId: this.utils.genRandom() });
          res(true);
        }
      });
    });
  }

  /**
   * insert data in db
   *
   * @param {object} data insert data in db
   * @param {*} returnId is true then return inseerted id
   * @returns {Promise} resolve to return true
   */
  insert(data, returnId) {
    return new Promise((res, rej) => {
      this.collection.insertOne(data, async (err, result) => {
        if (err) rej(err);
        else {
          if (returnId) {
            return res(result.insertedId);
          }
          res(true);
        }
      });
    });
  }

  /**
   * find in db
   *
   * @param {object} query find query
   * @param {number} limit limit query
   * @returns {Array} array of find result
   */
  find(query, limit = 0) {
    return new Promise((res, rej) => {
      if (limit > 0) {
        this.collection.find(query).limit(limit).toArray((err, data) => {
          if (err) rej(err);
          else res(data);
        });
      } else {
        this.collection.find(query).toArray((err, data) => {
          if (err) rej(err);
          else res(data);
        });
      }
    });
  }

  /**
   * update value in db
   *
   * @param {object} query find query
   * @param {object} update update object
   * @returns {Promise} resolve to true
   */
  update(query, update) {
    return new Promise((res, rej) => {
      this.collection.findOneAndUpdate(query, { $set: update }, (err) => {
        if (err) rej(err);
        else res(true);
      });
    });
  }

  /**
   * count records in db
   *
   * @param {object} query find query
   * @returns {Promise} resolve to Number
   */
  count(query) {
    return new Promise((res, rej) => {
      this.collection.countDocuments(query, (err, result) => {
        if (err) rej(err);
        else res(result);
      });
    });
  }

  /**
   * remove record from db
   *
   * @param {object} query find query
   * @returns {Promise} resolve to true
   */
  remove(query) {
    return new Promise((res, rej) => {
      this.collection.deleteMany(query, (err) => {
        if (err) rej(err);
        else res(true);
      });
    });
  }
}

module.exports = MongoDb;
