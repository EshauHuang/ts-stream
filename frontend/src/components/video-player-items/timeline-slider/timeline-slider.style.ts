import styled from "styled-components";

import { Scrubber } from "@/components/video-player-items/scrubber-spot/scrubber-spot.style";

export const Timeline = styled.div`
  width: 100%;
  height: 100%;
  transform: scaleY(0.6);
  background-color: rgba(255, 255, 255, 0.5);
  transition: transform 0.2s ease-in-out;
  overflow: hidden;

  &:after {
    content: "";
    position: absolute;
    right: calc(100% - var(--progress-position) * 100%);

    height: 100%;
    top: 0;
    left: 0;
    bottom: 0;
    background-color: red;
  }
`;


export const TimelineCursor = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 20px;
  z-index: 10;
`;

export const StyledTimelineContainer = styled.div<{
  isScrubbing: boolean;
  isLive: boolean;
}>`
  position: absolute;
  left: 50%;
  bottom: 100%;
  width: 97%;
  height: 0.5rem;
  cursor: ${({ isLive }) => (isLive ? "auto" : "pointer")};
  transform: translate(-50%);

  ${Timeline}, ${Scrubber} {
    transform: ${({ isScrubbing }) => isScrubbing && "scaleY(1)"};
  }

  ${({ isLive }) =>
    !isLive &&
    `
      &:hover {
        ${Timeline} {
          transform: scaleY(1);
          transition: transform 0.2s ease-in-out;
        }

        ${Scrubber} {
          transform: scale(1);
          transition: transform 0.2s ease-in-out;
        }
      }
  `}
`;