const { getSchema } = require("../helpers");
const db = require("../mongo-crud");

module.exports = async (req, res) => {
  const schema = getSchema();

  res.write(await db.collectionExists("videos"));
  res.end();
};
