const { getVideoById, updateVideoInDB } = require("../helpers");
const reader = require("../../vosk-reader.js");

module.exports = async (req, res) => {
  //res.write(`parse words for ${req.params.id}`);
  const video = getVideoById(req.params.id);

  if (video) {
    const file = `./media/${video.id}.wav`;
    const results = [];

    reader(
      file,
      (words) => {
        results.push(words);
      },
      () => {
        video.words = results;

        updateVideoInDB(video);
      }
    );

    res.write(`${video.id} parsed`);
    res.end();
  } else {
    res.end();
  }
};
