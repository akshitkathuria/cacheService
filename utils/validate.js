/**
 * this function checks that the requiredParams are present in the data or not
 *
 * @param {object} data input data
 * @param {Array} requiredParams params to be matched in the input data
 * @returns {boolean} true/ false
 */
module.exports = async (data, requiredParams) => {
  const missingParams = [];
  let isError = false;
  for (const param of requiredParams) {
    if (!(param in data)) {
      isError = true;
      missingParams.push(param);
    }
  }
  if (isError) {
    throw new Error(`missing parameters: ${missingParams.join(', ')}`);
  } else {
    return true;
  }
};
