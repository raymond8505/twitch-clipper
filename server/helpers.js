const { readFileSync, writeFileSync } = require("fs");
const getSchema = () => {
  const schemaRaw = readFileSync(__dirname + "/schema.json");

  return JSON.parse(schemaRaw.toString());
};
const convertHMS = (value) => {
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
};
const updateVideoInDB = (videoToUpdate) => {
  const db = JSON.parse(readFileSync(`${__dirname}\\db.json`));

  //console.log(db);

  db.videos = db.videos.filter(
    (video) => parseInt(video.id) !== parseInt(videoToUpdate.id)
  );

  db.videos.push(videoToUpdate);

  writeFileSync(`${__dirname}\\db.json`, JSON.stringify(db));
};

const videoExists = (id) => {
  const db = require(`${__dirname}/db.json`);

  return (
    db.videos.findIndex((video) => parseInt(video.id) === parseInt(id)) > -1
  );
};

const getVideoById = (id) => {
  const db = require(`${__dirname}/db.json`);

  return db.videos.find((video) => parseInt(video.id) === parseInt(id));
};
const getVideoFields = (video) => {
  //twurple does some kind of getter / setter fuckery so we need to grab the fields manually
  const {
    creationDate,
    description,
    duration,
    durationInSeconds,
    id,
    isPublic,
    language,
    //mutedSegmentData,
    publishDate,
    streamId,
    thumbnailUrl,
    title,
    type,
    url,
    userDisplayName,
    userId,
    userName,
    views,
  } = video;

  return {
    creationDate,
    description,
    duration,
    durationInSeconds,
    id,
    isPublic,
    language,
    //mutedSegmentData,
    publishDate,
    streamId,
    thumbnailUrl,
    title,
    type,
    url,
    userDisplayName,
    userId,
    userName,
    views,
  };
};
module.exports = {
  getSchema,
  convertHMS,
  updateVideoInDB,
  videoExists,
  getVideoFields,
  getVideoById,
};
