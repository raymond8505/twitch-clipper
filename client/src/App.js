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

  return (
    <>
      <ul>
        {videos.map((video) => {
          return (
            <li key={video.id}>
              <span>{video.id}</span>
              <button onClick={() => setCurVideo(video)}>Inspect</button>
            </li>
          );
        })}
      </ul>
      {curVideo && <Video video={curVideo} />}
    </>
  );
}

export default App;
