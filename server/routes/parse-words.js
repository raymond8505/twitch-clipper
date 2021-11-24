const { getVideoById, updateVideoInDB } = require("../helpers");
const reader = require("../../vosk-reader.js");
const log = require("single-line-log").stdout;

module.exports = async (req, res) => {
  //res.write(`parse words for ${req.params.id}`);
  const video = getVideoById(req.params.id);

  if (video) {
    const file = `./media/${video.id}.wav`;
    const results = [];

    reader(
      file,
      (words) => {
        const len = video.vod.durationInSeconds;

        //console.log(words?.alternatives[words.alternatives.length - 1]);

        const result =
          words?.alternatives[words.alternatives.length - 1]?.result;

        if (result) {
          const pos = result[result.length - 1].end;

          log(
            `(${pos} / ${len}) ${Math.round((pos / len) * 100)}% "${
              result[result.length - 1].word
            }"`
          );

          results.push(words);
        }
      },
      () => {
        video.words = results;

        updateVideoInDB(video);

        res.write(`${video.id} parsed`);
        console.log(`\n${video.id} parsed`);
        res.end();
      }
    );
  } else {
    res.end();
  }
};
