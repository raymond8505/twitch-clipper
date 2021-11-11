const { readFileSync } = require("fs");
const getSchema = () => {
  const schemaRaw = readFileSync(__dirname + "/schema.json");

  return JSON.parse(schemaRaw.toString());
};
module.exports = {
  getSchema,
};
