import { css } from "@emotion/css";
import { useEffect, useState } from "react";
import Video from "./Video";

function App() {
  const [videos, setVideos] = useState([]);
  const [curVideo, setCurVideo] = useState(null);

  useEffect(() => {
    fetch("//localhost:3001/videos").then((res) => {
      res.json().then((data) => {
        setVideos(data);
      });
    });
  }, []);

  const getNewVideos = () => {
    fetch("//localhost:3002/get-videos").then((res) => {
      res.json().then((data) => {
        console.log(data);
      });
    });
  };

  const parseVideo = (id) => {
    fetch(`//localhost:3002/parse-words/${id}`);
  };

  return (
    <div
      className={css`
        display: flex;
        align-items: stretch;
        padding: 1em;
        flex-wrap: wrap;
      `}
    >
      <header
        className={css`
          width: 100%;
          display: flex;
          justify-content: flex-end;
          position: sticky;
          top: 0;
          background: white;
        `}
      >
        <button onClick={getNewVideos}>Get New Videos</button>
      </header>
      <ul
        className={css`
          width: 25%;
          margin-right: 1em;
        `}
      >
        {videos
          .filter((vid) => vid.deleted !== true)
          .map((video) => {
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
                <a
                  href={`https://www.twitch.tv/videos/${video.id}`}
                  target="_blanket"
                >
                  {video.id}
                </a>
                <span>
                  {video.words?.length > 0 ? (
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
                <button onClick={() => setCurVideo(video)}>Inspect</button>
              </li>
            );
          })}
      </ul>
      {curVideo && <Video video={curVideo} />}
    </div>
  );
}

export default App;
