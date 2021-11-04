require("dotenv").config();

const { ClientCredentialsAuthProvider } = require("@twurple/auth");
const {
  promises: fs,
  rename,
  existsSync,
  readdirSync,
  unlinkSync,
} = require("fs");
const { ApiClient } = require("@twurple/api");
const tdl = require("twitchdl");
const { exec } = require("child_process");
const path = require("path");
const clientId = process.env.TWITCH_API_CLIENT_ID;
const clientSecret = process.env.TWITCH_API_CLIENT_SECRET;

console.log(`

=== ${new Date()} ===

`);

//console.log(clientId, clientSecret);

const authProvider = new ClientCredentialsAuthProvider(clientId, clientSecret);

const client = new ApiClient({ authProvider });

// console.log(
//   path.resolve(
//     "20211104_1195454929_raymond8505_mrspicy8505s_live_ps4_broadcast.mkv"
//   )
// );
// return;

client.users.getUserByName(process.env.TWITCH_API_USERNAME).then(async (me) => {
  const userID = me.id;

  // const channel = await client.channels.getChannelInfo(userID);

  // console.log(channel.displayName);

  const videos = await client.videos.getVideosByUser(me);

  videos.data.forEach(async (video) => {
    unlinkSync(`${video.id}.mkv`);

    console.log(`downloading ${video.url}`);

    const { stdout } = await exec(
      `python twitch-dl download -q source ${video.url}`,
      (err, stdout, stderr) => {
        //console.log(err, stdout, stderr);
      }
    );

    stdout.on("data", (data) => {
      data.split("\n").forEach((line) => {
        const fileMatch = line.match(/Downloaded: (.+\.mkv)/);

        if (fileMatch !== null) {
          const tempFileName = fileMatch[1];

          readdirSync(".").forEach((file) => {
            if ((file, video.id, file.indexOf(`_${video.id}_`) !== -1)) {
              if (existsSync(file)) {
                rename(file, `${video.id}.mkv`, () => {});
              }
            }
          });
        }
      });
    });
  });

  console.log(`finished downloading ${videos.data.length} videos`);
});
