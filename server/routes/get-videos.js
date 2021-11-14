require("dotenv").config();

const { ClientCredentialsAuthProvider } = require("@twurple/auth");
const { ApiClient } = require("@twurple/api");

const { exec, execSync } = require("child_process");

const {
  getSchema,
  updateVideoInDB,
  videoExists,
  getVideoFields,
} = require("../helpers");
const { existsSync, readdirSync, unlinkSync } = require("fs");
const clientId = process.env.TWITCH_API_CLIENT_ID;
const clientSecret = process.env.TWITCH_API_CLIENT_SECRET;

module.exports = async (req, res) => {
  const schema = getSchema();

  console.log("getting videos");

  const authProvider = new ClientCredentialsAuthProvider(
    clientId,
    clientSecret
  );

  const client = new ApiClient({ authProvider });

  client.users
    .getUserByName(process.env.TWITCH_API_USERNAME)
    .then(async (me) => {
      const userID = me.id;

      // const channel = await client.channels.getChannelInfo(userID);

      // console.log(channel.displayName);

      const videos = await client.videos.getVideosByUser(me);

      //console.log(`found ${videos.data.length} videos`);

      videos.data.forEach(async (video) => {
        if (videoExists(video.id)) {
          console.log(`skipping ${video.id} already exists`);
          return;
        }

        const { stdout } = await exec(
          `python twitch-dl download -q source ${video.url}`,
          (err, stdout, stderr) => {
            //console.log(err, stdout, stderr);
          }
        );

        stdout.on("data", (data) => {
          console.log(`${video.url} downloaded`);

          data.split("\n").forEach((line) => {
            const fileMatch = line.match(/Downloaded: (.+\.mkv)/);

            if (fileMatch !== null) {
              const tempFileName = fileMatch[1];

              readdirSync(".").forEach(async (file) => {
                if ((file, video.id, file.indexOf(`_${video.id}_`) !== -1)) {
                  if (existsSync(file)) {
                    //renameSync(file, `${video.id}.mkv`);

                    console.log("getting wav");
                    const wavFile = `./media/${video.id}.wav`;

                    execSync(
                      `ffmpeg -i ${file} -loglevel error -ac 1 -ar 16000 -acodec pcm_s16le ./media/${video.id}.wav`
                    );

                    unlinkSync(file);

                    const videoToSave = { ...schema };
                    videoToSave.vod = getVideoFields(video);
                    videoToSave.id = video.id;

                    updateVideoInDB(videoToSave);
                  }
                }
              });
            }
          });
        });
      });

      res.end();
    });
};
