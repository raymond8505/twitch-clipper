const reader = require("./vosk-reader.js");
const { existsSync, writeFileSync } = require("fs");
const { getAudioDurationInSeconds } = require("get-audio-duration");
const util = require("util");
const id = parseInt(process.argv[2]);
const db = require("./server/db.json");
const schema = require("./server/schema.json");

console.log("parsing", id);

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

function hasClip(word) {
  return word === "clip" || ["quip", "equip"].includes(word);
}

function readWav(file) {
  const results = [];

  getAudioDurationInSeconds(file).then((duration) => {
    reader(
      file,
      (words) => {
        results.push(words);
        // if (
        //   words.alternatives &&
        //   words.alternatives[words.alternatives.length - 1].result
        // ) {
        //   const lastAlt = words.alternatives[words.alternatives.length - 1];

        //   if (lastAlt.result) {
        //     const lastResult = lastAlt.result[lastAlt.result.length - 1];

        //     console.log({
        //       duration,
        //       lastAlt,
        //       lastResult,
        //     });
        //   }
        // }

        // words.alternatives.forEach((wordIn) => {
        //   //if (wordIn.result) console.log(duration, wordIn.result);

        //   if (wordIn.result) results.push(wordIn.result);

        //   wordIn.result?.forEach((word, i, results) => {
        //     if (hasClip(word.word)) {
        //       const seconds = word.start;
        //       console.log(
        //         "CLIP",
        //         `https://www.twitch.tv/videos/${id}?t=${convertHMS(
        //           seconds - 12
        //         )}`
        //       );
        //     }

        //     if (i == results.length - 1 && word.end > duration - 1)
        //       console.log("probably done");
        //   });
        // });
      },
      () => {
        const video = { ...schema.video };
        video.words = results;
        video.id = id;

        writeFileSync(
          "./server/db.json",
          JSON.stringify({
            ...db,
            videos: [...db.videos.filter((vid) => vid.id !== id), video],
          })
        );
      }
    );
  });
}

if (!existsSync(`./media/${id}.wav`)) {
  console.log(`./${id}.wav not found`);
  return;
}

readWav(`./media/${id}.wav`);
// readdirSync(".").forEach(async (file) => {
//   console.log(`=== ${file} ===`);

//   if (file.search(/.wav$/) != -1) {
//   }
// });
