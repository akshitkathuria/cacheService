/**
 * returns the cache service functions
 *
 * @param {Function} getState application state
 * @returns {object} returns the cache service functions
 */
const cache = (getState) => {
  const { db } = getState();

  return {
    /**
     * getCacheCount
     *
     * @returns {number} count of cache store in db
     */
    getCacheCount: async () => {
      const count = await db.cache.count();
      return count;
    },

    /**
     * save the cache
     *
     * @param {object} newCache cache to save
     * @returns {boolean} true/false
     */
    save: async (newCache) => {
      const result = await db.cache.insert(newCache);
      return result;
    },

    /**
     * getCacheByKey
     *
     * @param {string} key cache key
     * @returns {object} {ket, value, ttl}
     */
    getCacheByKey: async (key) => {
      const result = (await db.cache.find({ key }))[0];

      if (result && 'ttl' in result && 'value' in result) {
        return {
          key,
          value: result.value,
          ttl: result.ttl,
        };
      }
      return null;
    },

    /**
     * getAllCache
     *
     * @returns {Array} array of all cache key/value
     */
    getAllCache: async () => {
      const result = await db.cache.find({});
      return result;
    },

    /**
     * updateCacheByKey
     *
     * @param {string} key cache key
     * @param {object} updateObj cache update object
     * @returns {object} update cache object
     */
    updateCacheByKey: async (key, updateObj) => {
      const result = await db.cache.update({ key }, updateObj);
      return result;
    },

    /**
     * deleteCacheByKey
     *
     * @param {string} key cache key
     * @returns {boolean} true
     */
    deleteCacheByKey: async (key) => {
      await db.cache.remove({ key });
      return true;
    },

    /**
     * deleteAllCache
     *
     * @returns {boolean} true
     */
    deleteAllCache: async () => {
      await db.cache.remove();
      return true;
    },
  };
};

/**
 * intis the cache service
 *
 * @param {Function} getState application state
 * @param {object} config application config
 * @returns {object} cache service functions
 */
const init = async (getState, config) => cache(getState, config);

module.exports = { init };
