import { useEffect, useRef } from "react";
import videojs from "video.js";
import VideoJs from "@/components/video-js/video-js.component";

import { Container } from "./video-player.style"

const VideoPlayer = () => {
  const playerRef = useRef<null | videojs.Player>(null);

  const videoJsOptions = {
    liveui: true,
    controls: true,
    responsive: true,
    fluid: true,
    sources: [
      {
        src: "http://192.168.56.1:8080/hls/test.m3u8",
        type: "application/x-mpegURL",
      },
    ],
  };

  const handlePlayerReady = (player: videojs.Player) => {
    playerRef.current = player;

    console.log(player.liveTracker.seekableEnd());

    // You can handle player events here, for example:
    player.on("waiting", () => {
      videojs.log("player is waiting");
    });

    player.on("dispose", () => {
      videojs.log("player will dispose");
    });
  };

  return (
    <Container>
      <VideoJs options={videoJsOptions} onReady={handlePlayerReady} />
    </Container>
  );
};

export default VideoPlayer;
