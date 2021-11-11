const { getSchema } = require("../helpers");

module.exports = async (req, res) => {
  const schema = getSchema();

  res.end();
};
