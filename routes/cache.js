/**
 * init the routes of module
 *
 * @param {object} router express router
 * @param {Function} getState application state
 */
async function initRoutes(router, getState) {
  const { controllers } = getState();

  router.post('/create', controllers.cache.create);
  router.get('/', controllers.cache.getCache);
  router.delete('/', controllers.cache.deleteCache);
}

module.exports = { initRoutes };
