import { useEffect, useRef } from "react";
import videojs from "video.js";
import { Video } from "./video-js.style";

import "video.js/dist/video-js.css";

interface Props {
  options: videojs.PlayerOptions;
  onReady: (player: videojs.Player) => void;
}

const VideoJs: React.FC<Props> = (props) => {
  const videoRef = useRef<null | HTMLVideoElement>(null);
  const playerRef = useRef<null | videojs.Player>(null);
  const { options, onReady } = props;

  useEffect(() => {
    if (!playerRef.current) {
      const videoElement = videoRef.current;

      if (!videoElement) return;

      const player = (playerRef.current = videojs(videoElement, options, () => {
        videojs.log("player is ready");
        onReady && onReady(player);
      }));
    }
  }, [options, videoRef]);

  useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  return <Video ref={videoRef} className="video-js vjs-big-play-centered" />;
};

export default VideoJs;
