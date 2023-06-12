import ControlBar from "@/components/video-player-items/control-bar/control-bar.component";
import SettingMenu from "@/components/video-player-items/setting-menu/setting-menu.component";

import useVideoPlayer, { MenuStateName } from "@/hooks/useVideoPlayer";

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
  isShowSettingMenu: boolean;
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
  handleVideoEnded: () => void;
  handleChangeQuality: (id: number) => void;
  handleChangeSettingMenuState: (name: MenuStateName) => void;
  handleToggleSettingMenu: () => void;
}

export interface IVideoPlayer {
  src?: string;
  isLive: boolean;
  videoId?: string | number;
  thumbnail?: string;
}

const VideoPlayer: React.FC<IVideoPlayer> = ({
  src,
  videoId,
  isLive,
  thumbnail,
}) => {
  const {
    videoQualities,
    videoRef,
    timelineRef,
    videoOptions,
    videoControllers,
    findQuality,
    currentSettingMenuState,
  } = useVideoPlayer({
    src,
    videoId,
    isLive,
  });
  const { isFull, isTheater, isLoaded, isShowSettingMenu } = videoOptions;
  const {
    handleTogglePlay,
    handleVideoTime,
    handleVideoLoaded,
    handleVideoEnded,
    handleChangeQuality,
    handleChangeSettingMenuState,
  } = videoControllers;

  const shouldRenderVideo = src || videoId;

  const showThumbnail = thumbnail
    ? `${import.meta.env.VITE_API_SERVER_URL}${thumbnail}`
    : img5;

  return (
    <PlayerContainer isFull={isFull} isTheater={isTheater}>
      {shouldRenderVideo ? (
        <>
          <Video
            ref={videoRef}
            onClick={() => handleTogglePlay()}
            onTimeUpdate={(e) => handleVideoTime(e)}
            onLoadedMetadata={(e) => handleVideoLoaded(e)}
            onEnded={() => handleVideoEnded()}
          ></Video>
          {isShowSettingMenu && (
            <SettingMenu
              currentSettingMenuState={currentSettingMenuState}
              handleChangeSettingMenuState={handleChangeSettingMenuState}
              findQuality={findQuality}
              videoQualities={videoQualities}
              handleChangeQuality={handleChangeQuality}
            />
          )}
          {isLoaded && (
            <ControlBar
              timelineRef={timelineRef}
              videoOptions={videoOptions}
              videoControllers={videoControllers}
            />
          )}
        </>
      ) : (
        <Thumbnail src={showThumbnail} />
      )}
    </PlayerContainer>
  );
};

export default VideoPlayer;
