import { css } from "@emotion/css";
import { useState } from "react";

const VideoListItem = ({ video, setCurVideo, updateVideos }) => {
  const [parsing, setParsing] = useState(false);

  const parseVideo = (id) => {
    setParsing(true);
    fetch(`//localhost:3002/parse-words/${id}`).then(() => {
      setParsing(false);
      updateVideos();
    });
  };

  return (
    <li
      key={video.id}
      className={css`
        display: flex;
        justify-content: space-between;
        text-align: left;
        padding: 0.4em 0.8em;
        &:nth-child(even) {
          background-color: #efefef;
        }
      `}
    >
      <a href={`https://www.twitch.tv/videos/${video.id}`} target="_blanket">
        {video.id}
      </a>
      <span>
        {parsing ? (
          "parsing"
        ) : video.words?.length > 0 ? (
          "parsed"
        ) : (
          <button
            onClick={() => {
              parseVideo(video.id);
            }}
          >
            Parse Video
          </button>
        )}
      </span>
      {video.words && video.words.length > 0 && (
        <button onClick={() => setCurVideo(video)}>Inspect</button>
      )}
    </li>
  );
};

export default VideoListItem;
