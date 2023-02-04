import { useEffect, useRef, useState } from "react";

import Hls from "hls.js";
import HlsJs from "@/components/hls-js/hls-js.component";

import { Container, Video } from "./video-player.style";

interface IVideoPlayerProps {
  src?: string;
  videoId?: string | number;
}

const HlsJsPlayer: React.FC<IVideoPlayerProps> = ({ src, videoId }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const STREAM_SERVER_URL = import.meta.env.VITE_STREAM_SERVER_URL;

  useEffect(() => {
    const video = videoRef.current;

    if (!video || (!videoId && !src)) return;
    try {
      if (Hls.isSupported()) {
        const playVideo = () => {
          const hls = new Hls({
            liveSyncDurationCount: 0,
            liveMaxLatencyDurationCount: 1,
          });
          hls.attachMedia(video);

          hls.on(Hls.Events.MEDIA_ATTACHED, () => {
            hls.loadSource(`${STREAM_SERVER_URL}/${videoId}/index.m3u8`);

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
  }, [videoRef, src, videoId]);
  return (
    <Container>
      <Video ref={videoRef} id="video" muted />
    </Container>
  );
};

export default HlsJsPlayer;
