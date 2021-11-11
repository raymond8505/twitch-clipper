require("dotenv").config();

const { ClientCredentialsAuthProvider } = require("@twurple/auth");
const {
  promises: fs,
  renameSync,
  existsSync,
  readdirSync,
  unlinkSync,
} = require("fs");
const { ApiClient } = require("@twurple/api");
const tdl = require("twitchdl");
const { exec, execSync } = require("child_process");
const path = require("path");
const voskReader = require("./vosk-reader.js");

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

function convertHMS(value) {
  const sec = parseInt(value, 10); // convert value to number if it's string
  let hours = Math.floor(sec / 3600); // get hours
  let minutes = Math.floor((sec - hours * 3600) / 60); // get minutes
  let seconds = sec - hours * 3600 - minutes * 60; //  get seconds
  // add 0 if value < 10; Example: 2 => 02
  if (hours < 10) {
    hours = "0" + hours;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  return hours + "h" + minutes + "m" + seconds + "s"; // Return is HH : MM : SS
}

client.users.getUserByName(process.env.TWITCH_API_USERNAME).then(async (me) => {
  const userID = me.id;

  // const channel = await client.channels.getChannelInfo(userID);

  // console.log(channel.displayName);

  const videos = await client.videos.getVideosByUser(me);

  console.log(`found ${videos.data.length} videos`);

  videos.data.forEach(async (video) => {
    if (existsSync(`${video.id}.wav`)) {
      console.log(`${video.id}.wav exists`);
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
                const wavFile = `./${video.id}.wav`;

                execSync(
                  `ffmpeg -i ${file} -loglevel error -ac 1 -ar 16000 -acodec pcm_s16le ${video.id}.wav`
                );

                unlinkSync(file);
              }
            }
          });
        }
      });
    });
  });
});
