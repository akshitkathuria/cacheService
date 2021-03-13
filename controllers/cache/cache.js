/**
 * init cache controller
 *
 * @param {Function} getState application state
 * @returns {object} cache controller function
 */
const cache = (getState) => {
  const { modules, utils } = getState();
  return {
    /**
     * create and update cache controller
     *
     * @param {object} req express req object
     * @param {object} res express res object
     */
    async create(req, res) {
      const { queryId } = req.query;
      try {
        const input = req.body;
        await utils.validate(input, ['key', 'value']);
        const result = await modules.cache.create(input);
        res.status(200).json({ status: 'success', data: result });
      } catch (ex) {
        let statusCode = 500;
        if (ex.message.includes('missing parameters')) statusCode = 400;

        utils.logging.log(utils.logging.level.ERROR, 'req.getCache', ex.message, { queryId, error: ex });
        res.status(statusCode).json({ status: 'error', error: ex.message });
      }
    },

    /**
     * getCache controller
     *
     * @param {object} req express req object
     * @param {object} res express res object
     */
    async getCache(req, res) {
      const { queryId } = req.query;
      try {
        const { key } = req.query;
        const result = key ? await modules.cache.getCacheByKey(key, { queryId })
          : await modules.cache.getAllCache({ queryId });

        res.status(200).json({ status: 'success', data: result });
      } catch (ex) {
        utils.logging.log(utils.logging.level.ERROR, 'req.getCache', ex.message, { queryId, error: ex });
        res.status(500).json({ status: 'error', error: ex.message });
      }
    },

    /**
     * deleteCache controller
     *
     * @param {object} req express req object
     * @param {object} res express res object
     */
    deleteCache: async (req, res) => {
      const { queryId } = req.query;
      try {
        const { key } = req.query;

        if (key) await modules.cache.deleteCacheByKey(key);
        else await modules.cache.deleteAllCache();

        res.status(200).json({ status: 'success' });
      } catch (ex) {
        utils.logging.log(utils.logging.level.ERROR, 'req.deleteCache', ex.message, { queryId, error: ex });
        res.status(500).json({ status: 'error', error: ex.message });
      }
    },
  };
};

/**
 * init cache controller
 *
 * @param {Function} getState application state
 * @param {object} config application config
 * @returns {object} controller function
 */
const init = (getState, config) => cache(getState, config);

module.exports = { init };
