require("dotenv").config();

const { ClientCredentialsAuthProvider } = require("@twurple/auth");
const { promises: fs } = require("fs");
const { ApiClient } = require("@twurple/api");
const tdl = require("twitchdl");
const { exec } = require("child_process");

const clientId = process.env.TWITCH_API_CLIENT_ID;
const clientSecret = process.env.TWITCH_API_CLIENT_SECRET;

console.log(`

=== ${new Date()} ===

`);

//console.log(clientId, clientSecret);

let tokenData;

fs.readFile("./tokens.json", "UTF-8").then(async (data) => {
  tokenData = JSON.parse(data);

  //   const authProvider = new RefreshingAuthProvider(
  //     {
  //       clientId,
  //       clientSecret,
  //       onRefresh: async (newTokenData) =>
  //         await fs.writeFile(
  //           "./tokens.json",
  //           JSON.stringify(newTokenData, null, 4),
  //           "UTF-8"
  //         ),
  //     },
  //     tokenData
  //   );

  const authProvider = new ClientCredentialsAuthProvider(
    clientId,
    clientSecret
  );

  const client = new ApiClient({ authProvider });

  client.users.getUserByName("raymond8505").then(async (me) => {
    const userID = me.id;

    // const channel = await client.channels.getChannelInfo(userID);

    // console.log(channel.displayName);

    const videos = await client.videos.getVideosByUser(me);

    videos.data.forEach(async (video) => {
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
            const fileName = `./${fileMatch[1]}`;

            console.log(fileName);
          }
        });
      });
    });
  });
});
