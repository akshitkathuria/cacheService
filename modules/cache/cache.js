/**
 * init cache module function
 *
 * @param {Function} getState application state
 * @param {object} config application config
 * @returns {object} cache module funcions
 */
const cache = (getState, config) => {
  const { MAX_CACHE_LIMIT, CACHE_TTL } = config;
  const { services, utils } = getState();
  return {
    /**
     * create and update the cache in db
     *
     * @param {object} input {key, value}
     * @returns {object} {key, value, ttl}
     */
    async create(input) {
      const { key, value } = input;
      const ttl = utils.getTime() + CACHE_TTL;

      const cacheObj = await services.cache.getCacheByKey(key);
      if (cacheObj && 'ttl' in cacheObj && 'value' in cacheObj) {
        await services.cache.updateCacheByKey(key, { value, ttl });
      } else {
        const cacheCount = await services.cache.getCacheCount();

        if (cacheCount >= MAX_CACHE_LIMIT) {
          // removes the oldest cache
          const cacheArr = await services.cache.getAllCache();

          const smallestTtlCache = cacheArr.reduce((prev, curr) => (prev.ttl < curr.ttl ? prev : curr));

          await services.cache.deleteCacheByKey(smallestTtlCache.key);
        }

        await services.cache.save({ key, value, ttl });
      }

      return { key, value, ttl };
    },

    /**
     * getCacheByKey, returns the cache object find by key
     *
     * @param {string} key cache key
     * @param {string} param1 request id
     * @returns {object} {key, value, ttl}
     */
    async getCacheByKey(key, { queryId }) {
      const response = {
        key,
        value: null,
        ttl: null,
      };
      const result = await services.cache.getCacheByKey(key);

      if (result && 'ttl' in result && result.ttl > utils.getTime()) {
        utils.logging.log(utils.logging.level.INFO, 'cacheModules.getCacheByKey', `CACHE HIT for ${key}`, { queryId });
        const newTtl = utils.getTime() + CACHE_TTL;
        await services.cache.updateCacheByKey(key, { ttl: newTtl });
        response.value = result.value;
        response.ttl = newTtl;
      } else {
        utils.logging.log(utils.logging.level.INFO, 'cacheModules.getCacheByKey', `CACHE MISS for ${key}`, { queryId });
        const { value, ttl } = await this.create({ key, value: utils.genRandom() });
        response.value = value;
        response.ttl = ttl;
      }

      return response;
    },

    /**
     * getAllCache
     *
     * @returns {Array} array of all cache in db
     */
    getAllCache: async () => {
      const cacheArr = await services.cache.getAllCache();
      const result = [];

      for (const cacheObj of cacheArr) {
        const newTtl = new Date().getTime() + CACHE_TTL;
        if ('ttl' in cacheObj && cacheObj.ttl < utils.getTime()) {
          cacheObj.value = utils.genRandom();
        }
        await services.cache.updateCacheByKey(cacheObj.key, { ttl: newTtl, value: cacheObj.value });
        result.push(cacheObj);
      }

      return result;
    },

    /**
     * deleteCacheByKey
     *
     * @param {string} key cache key
     * @returns {boolean} true
     */
    deleteCacheByKey: async (key) => {
      const result = await services.cache.deleteCacheByKey(key);
      return result;
    },

    /**
     * deleteAllCache
     *
     * @returns {boolean} true
     */
    deleteAllCache: async () => {
      const result = await services.cache.deleteAllCache();
      return result;
    },
  };
};

/**
 * init cache module
 *
 * @param {Function} getState application state
 * @param {object} config application config
 * @returns {object} cache module function
 */
const init = async (getState, config) => cache(getState, config);

module.exports = { init };
