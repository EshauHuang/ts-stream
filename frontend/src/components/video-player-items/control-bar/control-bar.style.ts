import styled from "styled-components";

import {
  PlayPauseIcon,
  PlayStartIcon,
  FullScreenCloseIcon,
  FullScreenOpenIcon,
  MiniPlayerIcon,
  TheaterTallIcon,
  TheaterWideIcon,
  CaptionsIcon,
  VolumeHighIcon,
  VolumeLowIcon,
  VolumeMutedIcon,
} from "@/components/ui/icon.style";

import SettingsIcon from '@mui/icons-material/Settings';

export const ControlBarLeftPart = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
`;

export const ControlBarRightPart = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
`;

export const StyledMiniPlayerButton = styled.div`
  display: flex;
  align-items: center;
`;

export const StyledPlayButton = styled.div`
  display: flex;
  align-items: center;
`;

export const StyledFullScreenButton = styled.div`
  display: flex;
  align-items: center;
`;

export const StyledTheaterButton = styled.div`
  display: flex;
  align-items: center;
`;

export const TimeString = styled.span`
  color: white;
  font-size: 1.2rem;
  margin-left: 0.5rem;
`;

export const ControlBarContainer = styled.div<{ isScrubbing: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;

  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 5rem;
  opacity: ${({ isScrubbing }) => (isScrubbing ? 1 : 0)};
  transition: opacity 0.2s ease-out;

  ${PlayPauseIcon},
  ${PlayStartIcon},

  ${FullScreenCloseIcon},
  ${FullScreenOpenIcon},
  ${MiniPlayerIcon},
  ${TheaterTallIcon},
  ${TheaterWideIcon},
  ${CaptionsIcon} {
    width: 35px;
    height: 35px;
    margin: 0 1.5rem;
    cursor: pointer;
    color: white;
  }

  ${VolumeHighIcon},
  ${VolumeLowIcon},
  ${VolumeMutedIcon} {
    width: 32px;
    height: 32px;
    margin: 0 1.5rem;
    cursor: pointer;
    color: white;
  }
`;

export const SettingButton = styled(SettingsIcon) <{ isShowSettingMenu: boolean }>`
  width: 3.5rem;
  height: 3.5rem;
  margin: 0 1.5rem;
  cursor: pointer;
  color: white;
  transform: ${({ isShowSettingMenu }) => isShowSettingMenu && `rotate(45deg)`};
  transition: transform .4s ease;
`