import styled from "styled-components"

import { ControlBarContainer } from "@/components/video-player-items/control-bar/control-bar.style";

export const Video = styled.video`
  background-color: black;
  width: 100%;
  height: 100%;
  display: block;
`;

export const Thumbnail = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
`;

export const PlayerContainer = styled.div<{ isTheater: boolean; isFull: boolean }>`
  position: relative;
  margin: 0 auto;
  width: 100%;
  max-width: 100rem;
  max-height: 60rem;
  height: 60rem;
  background-color: black;

  &:hover {
    ${ControlBarContainer} {
      opacity: 1;
    }
  }

  ${({ isTheater }) =>
    isTheater &&
    `
      width: 100%;
      max-width: initial;
  `}

  ${({ isFull }) =>
    isFull &&
    `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100vh;
      max-width: initial;
      max-height: none;
  `}
`;