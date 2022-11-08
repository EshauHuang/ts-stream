import { useEffect, useRef, useState } from "react";
import videojs from "video.js";
import VideoJs from "@/components/video-js/video-js.component";

import Hls from "hls.js";
import HlsJs from "@/components/hls-js/hls-js.component";

import { Container, Video } from "./video-player.style";

interface IVideoPlayerProps {
  isStreamOn: boolean;
}

const VideoJsPlayer: React.FC<IVideoPlayerProps> = ({ isStreamOn }) => {
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

const HlsJsPlayer: React.FC<IVideoPlayerProps> = ({ isStreamOn }) => {
  const videoRef = useRef(null);

  // useEffect(() => {
  //   fetch("http://192.168.64.1:3000/check-stream")
  //     .then((res) => res.json())
  //     .then((result) => setIsStreamOn(result))
  //     .catch((err) => console.log(err));
  // }, []);

  useEffect(() => {
    if (!videoRef.current || !isStreamOn) return;

    if (Hls.isSupported()) {
      const video = videoRef.current;
      const hls = new Hls();
      hls.attachMedia(video);

      hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        hls.loadSource(
          "http://192.168.64.2/3/index.m3u8"
        );
      });
    }
  }, [videoRef, isStreamOn]);
  return (
    <Container>
      <Video controls ref={videoRef} id="video" />
    </Container>
  );
};

export default HlsJsPlayer;
