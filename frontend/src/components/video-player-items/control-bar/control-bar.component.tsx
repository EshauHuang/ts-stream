import { useContext } from "react";

import TimelineSlider from "@/components/video-player-items/timeline-slider/timeline-slider.component";
import LiveBlock from "@/components/video-player-items/live-block/live-block.component";
import VolumeBlock from "@/components/video-player-items/volume-block/volume-block.component";

import renderTimeString from "@/utils/renderTimeString";

import { CommentsContext } from "@/contexts/commentsContext";

import { IVideoOptions } from "@/contexts/videoOptionsContext";
import { IVideoControllers } from "@/hooks/useVideoPlayer";

import {
  MiniPlayerIcon,
  PlayStartIcon,
  PlayPauseIcon,
  FullScreenCloseIcon,
  FullScreenOpenIcon,
  TheaterWideIcon,
  TheaterTallIcon,
} from "@/components/ui/icon.style";
import {
  StyledMiniPlayerButton,
  StyledPlayButton,
  StyledTheaterButton,
  StyledFullScreenButton,
  ControlBarContainer,
  ControlBarLeftPart,
  ControlBarRightPart,
  SettingButton,
  TimeString,
} from "./control-bar.style";

const MiniPlayerButton = ({
  isFull,
  handleToggleMiniMode,
}: {
  isFull: boolean;
  handleToggleMiniMode: () => void;
}) => {
  return (
    <StyledMiniPlayerButton onClick={handleToggleMiniMode}>
      {!isFull && <MiniPlayerIcon />}
    </StyledMiniPlayerButton>
  );
};

const PlayButton = ({
  handleTogglePlay,
  isPlay,
}: {
  handleTogglePlay: () => void;
  isPlay: boolean;
}) => {
  return (
    <StyledPlayButton onClick={() => handleTogglePlay()}>
      {isPlay ? <PlayPauseIcon /> : <PlayStartIcon />}
    </StyledPlayButton>
  );
};

const FullScreenButton = ({
  isFull,
  handleToggleFullMode,
}: {
  isFull: boolean;
  handleToggleFullMode: () => void;
}) => {
  return (
    <StyledFullScreenButton onClick={() => handleToggleFullMode()}>
      {isFull ? <FullScreenCloseIcon /> : <FullScreenOpenIcon />}
    </StyledFullScreenButton>
  );
};

const TheaterButton = ({
  isTheater,
  handleToggleTheaterMode,
}: {
  isTheater: boolean;
  handleToggleTheaterMode: () => void;
}) => {
  return (
    <StyledTheaterButton onClick={() => handleToggleTheaterMode()}>
      {isTheater ? <TheaterWideIcon /> : <TheaterTallIcon />}
    </StyledTheaterButton>
  );
};

const ControlBar = ({
  videoOptions,
  timelineRef,
  videoControllers,
}: {
  timelineRef: React.RefObject<HTMLDivElement>;
  videoOptions: IVideoOptions;
  videoControllers: IVideoControllers;
}) => {
  const {
    isScrubbing,
    isPlay,
    isLive,
    volume,
    isMuted,
    isTheater,
    isFull,
    currentTime,
    duration,
    isShowSettingMenu,
  } = videoOptions;

  const {
    handleUpdateVideoTimeByTimeline,
    handleMouseUp,
    handleTogglePlay,
    handleToggleMute,
    handleChangeVolume,
    handleToggleMiniMode,
    handleToggleTheaterMode,
    handleToggleFullMode,
    handleToggleSettingMenu,
  } = videoControllers;

  const { fetchNewCommentsAndAddToDelayComments } = useContext(CommentsContext);

  return (
    <ControlBarContainer isScrubbing={isScrubbing}>
      <TimelineSlider
        ref={timelineRef}
        isLive={isLive}
        isScrubbing={isScrubbing}
        handleUpdateVideoTimeByTimeline={handleUpdateVideoTimeByTimeline}
        handleMouseUp={() => {
          fetchNewCommentsAndAddToDelayComments();
          handleMouseUp();
        }}
      />
      <ControlBarLeftPart>
        <PlayButton isPlay={isPlay} handleTogglePlay={handleTogglePlay} />
        <VolumeBlock
          volume={volume}
          isMuted={isMuted}
          handleToggleMute={handleToggleMute}
          handleChangeVolume={handleChangeVolume}
        />
        {isLive ? (
          <LiveBlock />
        ) : (
          <TimeString>
            {renderTimeString(currentTime)} / {renderTimeString(duration)}
          </TimeString>
        )}
      </ControlBarLeftPart>
      <ControlBarRightPart>
        <SettingButton
          isShowSettingMenu={isShowSettingMenu}
          onClick={() => handleToggleSettingMenu()}
        />
        <MiniPlayerButton
          isFull={isFull}
          handleToggleMiniMode={handleToggleMiniMode}
        />
        <TheaterButton
          isTheater={isTheater}
          handleToggleTheaterMode={handleToggleTheaterMode}
        />
        <FullScreenButton
          isFull={isFull}
          handleToggleFullMode={handleToggleFullMode}
        />
      </ControlBarRightPart>
    </ControlBarContainer>
  );
};

export default ControlBar;
