/**
 * this function generates the random number
 *
 * @returns {number} random number
 */
module.exports = () => new Date().getTime() * 1000 + Math.round(Math.random() * 1000);
