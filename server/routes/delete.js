module.exports = async (req, res) => {
  res.write(`delete ${req.params.id}`);

  res.end();
};
