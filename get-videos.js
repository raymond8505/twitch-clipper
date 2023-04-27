const { existsSync, readdirSync, unlinkSync, renameSync } = require("fs");
const { execSync } = require("child_process");
const reader = require("./vosk-reader.js");
const log = require("single-line-log").stdout;
const { getVideoDurationInSeconds } = require("get-video-duration");
const {
  getSchema,
  updateVideoInDB,
  videoExists,
  getVideoFields,
} = require("./server/helpers");

const { getClipsFromWords } = require("./helpers");

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

const readAudio = async (audioToParse, duration) => {
  const results = [];

  return new Promise((resolve) => {
    reader(
      audioToParse,
      (words) => {
        const result =
          words?.alternatives[words.alternatives.length - 1]?.result;
        if (result) {
          const pos = result[result.length - 1].end;
          const progress = `(${pos} / ${duration}) ${Math.round(
            (pos / duration) * 100
          )}%`;

          results.push(words);

          log(`${progress} "${result[result.length - 1].word}"`);
        }
      },
      () => {
        console.log();
        resolve(results);
      }
    );
  });
};

readdirSync(toParseDir).forEach(async (videoToParse) => {
  const audioToParse = `${rawAudioDir}/${videoToParse}.wav`;
  const videoToParsePath = `${toParseDir}/${videoToParse}`;

  console.log("=== Converting Video", videoToParse, " ===");

  if (existsSync(audioToParse)) {
    unlinkSync(audioToParse);
  }

  const test = execSync(
    `ffmpeg -i "${toParseDir}/${videoToParse}" -loglevel error -ac 1 -ar 16000 -acodec pcm_s16le "${audioToParse}"`
  );

  console.log("Created ", audioToParse);

  const duration = await getVideoDurationInSeconds(videoToParsePath);
  const results = await readAudio(audioToParse, duration);

  //get unique clips
  const clips = getClipsFromWords(results).filter((clip, index, array) => {
    return array.findIndex((clip2) => clip2.end === clip.end) === index;
  });

  console.log("found", clips.length, "clips");

  clips.forEach((clip, i) => {
    const start = Math.max(clip.end - 20, 0);
    const end = Math.min(clip.end + 10, duration);

    const clipPath = `${clipsAudioDir}/${videoToParse}_${i}.mp4`;

    if (existsSync(clipPath)) {
      unlinkSync(clipPath);
    }

    console.log("clipping", i + 1, "/", clips.length);

    execSync(
      `ffmpeg -i ${videoToParsePath}  -loglevel error -ss ${start} -to ${end} ${clipPath}`
    );
  });

  console.log("moving", videoToParse, "to parsed");
  renameSync(videoToParsePath, `${parsedDir}/${videoToParse}`);
  console.log("DONE!");
});
