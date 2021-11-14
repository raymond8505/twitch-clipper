import { css } from "@emotion/css";
import { useEffect, useState } from "react";
import Video from "./Video";
import VideoListItem from "./VideoListItem";

function App() {
  const [videos, setVideos] = useState([]);
  const [curVideo, setCurVideo] = useState(null);

  const updateVideos = () => {
    fetch("//localhost:3001/videos").then((res) => {
      res.json().then((data) => {
        setVideos(data);
      });
    });
  };
  useEffect(() => {
    updateVideos();
  }, []);

  const getNewVideos = () => {
    fetch("//localhost:3002/get-videos").then((res) => {
      res.json().then((data) => {
        updateVideos();
      });
    });
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
              <VideoListItem
                video={video}
                setCurVideo={setCurVideo}
                updateVideos={updateVideos}
              />
            );
          })}
      </ul>
      {curVideo && <Video video={curVideo} />}
    </div>
  );
}

export default App;
