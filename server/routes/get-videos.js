require("dotenv").config();

const { ClientCredentialsAuthProvider } = require("@twurple/auth");
const { ApiClient } = require("@twurple/api");

const { exec } = require("child_process");

const {
  getSchema,
  updateVideoInDB,
  videoExists,
  getVideoFields,
} = require("../helpers");

const schema = getSchema().videos;

const { existsSync, readdirSync, unlinkSync } = require("fs");
const clientId = process.env.TWITCH_API_CLIENT_ID;
const clientSecret = process.env.TWITCH_API_CLIENT_SECRET;

const saveVideoData = (video) => {
  console.log("saving video data");
  const videoToSave = { ...schema };
  videoToSave.vod = getVideoFields(video);
  videoToSave.id = video.id;

  updateVideoInDB(videoToSave);

  console.log("finished getting", video.id);
};

module.exports = async (req, res) => {
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

      const videos = await client.videos.getVideosByUser(me, {
        limit: 100,
        first: 1,
      });

      console.log(`found ${videos.data.length} videos`);

      videos.data.forEach(async (video, i) => {
        const { stdout } = await exec(
          `python twitch-dl download -q source ${video.url}`,
          (err, stdout, stderr) => {
            //console.log(err, stdout, stderr);
          }
        );

        stdout.on("data", (data) => {
          console.log(`${video.url} downloaded`);

          data.split("\n").forEach((line) => {
            //console.log(line);
            const fileMatch = line.match(/Downloaded: (.+\.mkv)/);

            if (fileMatch !== null) {
              const tempFileName = fileMatch[1];

              readdirSync(".").forEach(async (file) => {
                if (file.indexOf(`_${video.id}_`) !== -1) {
                  if (existsSync(file)) {
                    console.log("getting wav");
                    const wavFile = `./media/${video.id}.wav`;

                    if (existsSync(wavFile)) {
                      console.log(wavFile, "exists");
                      if (!videoExists(video.id)) saveVideoData(video);
                      unlinkSync(file);

                      if (i === videos.data.length - 1)
                        console.log("== DONE ==");
                    } else {
                      exec(
                        `ffmpeg -i ${file} -loglevel error -ac 1 -ar 16000 -acodec pcm_s16le ${wavFile}`,
                        (e, data, err) => {
                          console.log("got wav", { wavFile, data });

                          unlinkSync(file);

                          saveVideoData(video);

                          if (i === videos.data.length - 1)
                            console.log("== DONE ==");
                        }
                      );
                    }
                  }
                }
              });
            }
          });
        });

        return;
      });

      res.end();
    });
};
