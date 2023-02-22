import {
  VolumeMutedIcon,
  VolumeHighIcon,
  VolumeLowIcon,
} from "@/components/ui/icon.style";

import {
  StyledVolumeButton,
  StyledVolumeBlock,
  VolumeSlider,
} from "./volume-block.style";

export const VolumeButton = ({
  volume,
  isMuted,
  handleToggleMute,
}: {
  volume: number;
  isMuted: boolean;
  handleToggleMute: () => void;
}) => {
  return (
    <StyledVolumeButton onClick={handleToggleMute}>
      {isMuted || volume === 0 ? (
        <VolumeMutedIcon />
      ) : (
        <>{volume >= 0.5 ? <VolumeHighIcon /> : <VolumeLowIcon />}</>
      )}
    </StyledVolumeButton>
  );
};

const VolumeBlock = ({
  volume,
  isMuted,
  handleToggleMute,
  handleChangeVolume,
}: {
  volume: number;
  isMuted: boolean;
  handleToggleMute: () => void;
  handleChangeVolume: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <StyledVolumeBlock>
      <VolumeButton
        volume={volume}
        isMuted={isMuted}
        handleToggleMute={handleToggleMute}
      />
      <VolumeSlider
        volume={isMuted ? 0 : volume}
        type="range"
        min="0"
        max="1"
        step="any"
        value={isMuted ? 0 : volume}
        onChange={handleChangeVolume}
      ></VolumeSlider>
    </StyledVolumeBlock>
  );
};

export default VolumeBlock