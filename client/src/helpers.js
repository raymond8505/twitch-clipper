export const secondsToHMS = (value) => {
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

export const HMSToSeconds = (hms) => {
  const hmsSplit = hms.split(":");

  return (
    parseInt(hmsSplit[0].replace(/^0/, "")) * 60 +
    parseInt(hmsSplit[1].replace(/^0/, ""))
  );
};

export const hasClip = (word) => {
  return (
    word.trim() === "clip" ||
    ["quip", "equip", "claire", "a twit", "cliff"].includes(word.trim())
  );
};

export const hasDelete = (word) => {
  return (
    word.trim() === "delete" ||
    ["deleted", "d lead", "di lead", "dee lead"].includes(word.trim())
  );
};

export const alternativeHasClip = (alt) => {
  if (alt.result === undefined) return false;

  let ret = false;

  alt.result.forEach((res) => {
    if (hasClip(res.word)) {
      ret = true;
      return;
    }
  });

  return ret;
};

export const alternativeHasDelete = (alt) => {
  if (alt.result === undefined) return false;

  let ret = false;

  alt.result.forEach((res) => {
    if (hasDelete(res.word)) {
      ret = true;
      return;
    }
  });

  return ret;
};

export const getClipsFromWords = (words) => {
  const alts = [];
  const results = [];

  words.forEach((word) => {
    word.alternatives.forEach((alt) => {
      if (alternativeHasClip(alt)) {
        alts.push(alt);
      }
    });
  });

  //only return the first result in the alt matching the clip
  alts.forEach((alt) => {
    results.push(alt.result.find((result) => hasClip(result.word)));
  });

  return results;
};

export const getDeletesFromWords = (words) => {
  const results = [];
  const alts = [];

  words.forEach((word) => {
    word.alternatives.forEach((alt) => {
      if (alternativeHasDelete(alt)) {
        alts.push(alt);
      }
    });
  });

  alts.forEach((alt) => {
    results.push(alt.result.find((result) => hasDelete(result.word)));
  });

  return results;
};
