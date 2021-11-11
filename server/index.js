const express = require("express");
const router = require("./routes");
const app = express();
router(app);

app.listen(3002, function () {
  console.log("Listening to Port 3002");
});
