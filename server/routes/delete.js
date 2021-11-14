require("dotenv").config();

const { ClientCredentialsAuthProvider } = require("@twurple/auth");
const { ApiClient } = require("@twurple/api");
const { writeFileSync, unlinkSync } = require("fs");

const clientId = process.env.TWITCH_API_CLIENT_ID;
const clientSecret = process.env.TWITCH_API_CLIENT_SECRET;
const authProvider = new ClientCredentialsAuthProvider(clientId, clientSecret);

const client = new ApiClient({ authProvider });

module.exports = async (req, res) => {
  res.write(`delete ${req.params.id}`);

  //TODO: figure out why no work
  //client.videos.deleteVideosByIds([`${req.params.id}`]);

  const dbRaw = require("../db.json");
  const db = { ...dbRaw };

  const videoToDelete = db.videos.find(
    (video) => parseInt(video.id) === parseInt(req.params.id)
  );

  db.videos = db.videos.filter(
    (video) => parseInt(video.id) !== parseInt(req.params.id)
  );
  db.videos.push({
    ...videoToDelete,
    deleted: true,
  });

  //console.log(db.videos, __dirname);

  writeFileSync(
    __dirname.replace("\\routes", "") + "\\db.json",
    JSON.stringify(db)
  );

  unlinkSync(`./media/${req.params.id}.wav`);

  res.end();
};
