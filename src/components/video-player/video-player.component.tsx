import { getComments } from "@/api/stream";
import ControlBar from "@/components/video-player-items/control-bar/control-bar.component";
import { useRef, useContext } from "react";
import { CommentsContext } from "@/contexts/commentsContext";

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
  const {
    isSourceLoaded,
    videoRef,
    timelineRef,
    videoOptions,
    videoControllers,
  } = useVideoPlayer({
    src,
    videoId,
    isLive,
  });
  const { isFull, isTheater, currentTime, isPlay, isPlaying } = videoOptions;
  const { handleTogglePlay, handleVideoTime, handleVideoLoaded } =
    videoControllers;
  const realTimeRef = useRef(0);

  const { setChatTime } = useContext(CommentsContext);

  // e: React.SyntheticEvent<HTMLVideoElement>
  const commentsUpdate = async () => {
    // const { currentTime } = e.target as HTMLVideoElement;
    // 依據 currentTime 去抓取 comments
    const realTime = 1675759497647 + currentTime * 1000;
    setChatTime(realTime);
    const comments = await getComments("1", realTime);

    // console.log(comments);

    // 依據 comments time 將留言加至聊天室

    // 如抓到的 comments 已經都加進聊天室，則以最後一則留言的時間在次數抓取留言
  };

  commentsUpdate();

  return (
    <>
      <PlayerContainer isFull={isFull} isTheater={isTheater}>
        {isSourceLoaded ? (
          <>
            <Video
              ref={videoRef}
              onClick={() => handleTogglePlay()}
              onTimeUpdate={(e) => {
                handleVideoTime(e);
              }}
              onLoadedMetadata={(e) => handleVideoLoaded(e)}
            ></Video>
            <ControlBar
              timelineRef={timelineRef}
              videoOptions={videoOptions}
              videoControllers={videoControllers}
            />
          </>
        ) : (
          <Thumbnail src={img5} />
        )}
      </PlayerContainer>
    </>
  );
};

export default VideoPlayer;
