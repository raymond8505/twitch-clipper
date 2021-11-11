// C:\Users\Raymond\Downloads\1198318322-502129947-05325b35-5df4-41a2-a105-40cdae17d1e1.mp4
const fileIn = process.argv[2];
const { execSync, spawnSync } = require("child_process");
const { existsSync } = require("fs");
const reader = require("./vosk-reader.js");

const idReg = /\\([\d]+)-/;

const id = fileIn.match(idReg)[1];

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

if (!existsSync(`${id}.wav`)) {
  //execSync(`ffmpeg -i ${fileIn} -ac 1 -ar 16000 -acodec pcm_s16le ${id}.wav`);
  const ffmpeg_run = spawnSync("ffmpeg", [
    "-loglevel",
    "quiet",
    "-i",
    fileIn,
    "-ar",
    String(16000),
    "-ac",
    "1",
    "-f",
    "s16le",
    "-bufsize",
    String(4000),
    `${id}.wav`,
  ]);
}

reader(`${__dirname}\\${id}.wav`, (words) => {
  console.log(words);
});
