import { useEffect, useRef, useState } from "react";
import videojs from "video.js";
import VideoJs from "@/components/video-js/video-js.component";

import Hls from "hls.js";
import HlsJs from "@/components/hls-js/hls-js.component";

import { Container, Video } from "./video-player.style";

interface IVideoPlayerProps {
  isStreamOn: boolean;
}

export const VideoJsPlayer: React.FC<IVideoPlayerProps> = ({ isStreamOn }) => {
  const playerRef = useRef<null | videojs.Player>(null);

  const videoJsOptions = {
    liveui: true,
    controls: true,
    responsive: true,
    fluid: true,
    sources: [
      {
        src: "http://192.168.64.2/2/index.m3u8",
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
  const [isStreamExist, setIsStreamExist] = useState(false);
  const STREAM_SERVER_URL = import.meta.env.VITE_STREAM_SERVER_URL;

  console.log("isStreamOn", isStreamOn);

  useEffect(() => {
    if (!videoRef.current || !isStreamOn) return;
    try {
      if (Hls.isSupported()) {
        const playVideo = (el, url) => {
          const video = videoRef.current;
          const hls = new Hls({
            liveSyncDurationCount: 0,
            liveMaxLatencyDurationCount: 1,
          });
          hls.attachMedia(video);

          hls.on(Hls.Events.MEDIA_ATTACHED, () => {
            hls.loadSource(`${STREAM_SERVER_URL}/2/index.m3u8`);

            hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
              video.play();
            });
          });

          hls.on(Hls.Events.ERROR, function (event, data) {
            var errorType = data.type;
            var errorDetails = data.details;
            var errorFatal = data.fatal;

            switch (errorType) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                hls.destroy();
                playVideo();
                break;
              default:
                break;
            }
          });
        };

        playVideo();
      }
    } catch (err) {}
  }, [videoRef, isStreamOn]);
  return (
    <Container>
      <Video ref={videoRef} id="video" muted />
    </Container>
  );
};

export default HlsJsPlayer;
