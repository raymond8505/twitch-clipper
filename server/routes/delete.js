require("dotenv").config();

const { ClientCredentialsAuthProvider } = require("@twurple/auth");
const { ApiClient } = require("@twurple/api");
const { writeFileSync, unlinkSync, readFileSync, existsSync } = require("fs");
const { updateVideoInDB } = require("../helpers");

const clientId = process.env.TWITCH_API_CLIENT_ID;
const clientSecret = process.env.TWITCH_API_CLIENT_SECRET;
const authProvider = new ClientCredentialsAuthProvider(clientId, clientSecret);

const client = new ApiClient({ authProvider });

module.exports = async (req, res) => {
  res.write(`delete ${req.params.id}`);

  //TODO: figure out why no work
  //client.videos.deleteVideosByIds([`${req.params.id}`]);

  console.log();

  const dbRaw = readFileSync(
    `${__dirname.replace("\\server\\routes", "")}\\server\\db.json`,
    { flag: "rs+" }
  );
  const db = { ...JSON.parse(dbRaw) };

  console.log({ db });

  const videoToDelete = db.videos.find((video) => {
    console.log(parseInt(video.id), parseInt(req.params.id));
    return parseInt(video.id) === parseInt(req.params.id);
  });

  console.log(videoToDelete);

  if (videoToDelete !== undefined) {
    updateVideoInDB({
      ...videoToDelete,
      deleted: true,
    });
  }

  const wav = `${__dirname.replace("\\server\\routes", "")}\\media\\${
    req.params.id
  }.wav`;

  if (existsSync(wav)) {
    unlinkSync(wav);
  }

  res.end();

  console.log(req.params.id, "deleted");
};
