const { existsSync, readdirSync, unlinkSync } = require("fs");
const { exec } = require("child_process");

const {
  getSchema,
  updateVideoInDB,
  videoExists,
  getVideoFields,
} = require("./server/helpers");

const toParseDir = `./media/video/to-parse`;
const parsedDir = `./media/video/parsed`;
const audioDir = `./media/audio`;
const rawAudioDir = `${audioDir}/raw`;
const clipsAudioDir = `${audioDir}/clips`;
const schema = getSchema().videos;

const saveVideoData = (video) => {
  console.log("saving video data");
  const videoToSave = { ...schema };
  videoToSave.vod = getVideoFields(video);
  videoToSave.id = video.id;

  updateVideoInDB(videoToSave);

  console.log("finished getting", video.id);
};

readdirSync(toParseDir).forEach((videoToParse) => {
  const audioToParse = `${rawAudioDir}/${videoToParse}.wav`;

  if (existsSync(audioToParse)) {
    unlinkSync(audioToParse);
  }

  exec(
    `ffmpeg -i "${toParseDir}/${videoToParse}" -loglevel error -ac 1 -ar 16000 -acodec pcm_s16le "${audioToParse}"`,
    (e, data, err) => {
      console.log("got wav", { audioToParse, data });
    }
  );
});
