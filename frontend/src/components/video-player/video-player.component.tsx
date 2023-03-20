import ControlBar from "@/components/video-player-items/control-bar/control-bar.component";

import useVideoPlayer from "@/hooks/useVideoPlayer";

import { PlayerContainer, Video, Thumbnail } from "./video-player.style";

import img5 from "/images/2.jpg";

export interface IVideoOptions {
  isLive: boolean;
  volume: number;
  isScrubbing: boolean;
  isTheater: boolean;
  isMuted: boolean;
  isPlay: boolean;
  isPlaying: boolean;
  isMini: boolean;
  isFull: boolean;
  setTime: undefined | number;
  currentTime: number;
  duration: number;
}

export interface IVideoControllers {
  handleTogglePlay: () => void;
  handleChangeVolume: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleToggleMute: () => void;
  handleToggleTheaterMode: () => void;
  handleToggleMiniMode: () => void;
  handleToggleFullMode: () => void;
  handleUpdateVideoTimeByTimeline: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => void;
  handleMouseUp: () => void;
}

export interface IVideoPlayer {
  src?: string;
  isLive?: boolean;
  videoId?: string | number;
}

const VideoPlayer: React.FC<IVideoPlayer> = ({
  src,
  videoId,
  isLive = true,
}) => {
  const { videoRef, timelineRef, videoOptions, videoControllers } =
    useVideoPlayer({
      src,
      videoId,
      isLive,
    });
  const { isFull, isTheater, isLoaded } = videoOptions;
  const { handleTogglePlay, handleVideoTime, handleVideoLoaded } =
    videoControllers;

  const shouldRenderVideo = src || videoId;

  return (
    <PlayerContainer isFull={isFull} isTheater={isTheater}>
      {shouldRenderVideo ? (
        <>
          <Video
            ref={videoRef}
            onClick={() => handleTogglePlay()}
            onTimeUpdate={(e) => handleVideoTime(e)}
            onLoadedMetadata={(e) => handleVideoLoaded(e)}
          ></Video>
          {isLoaded && (
            <ControlBar
              timelineRef={timelineRef}
              videoOptions={videoOptions}
              videoControllers={videoControllers}
            />
          )}
        </>
      ) : (
        <Thumbnail src={img5} />
      )}
    </PlayerContainer>
  );
};

export default VideoPlayer;
