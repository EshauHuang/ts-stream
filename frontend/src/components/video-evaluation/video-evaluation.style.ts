import styled, { css } from "styled-components";

import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";


export const IconStyle = css`
  padding: 8px 0;
  width: 40px;
  height: 40px;
  color: #fff;
`;

export const ThumbUpAltIconButton = styled(ThumbUpAltIcon)`
  ${IconStyle}
`;

export const ThumbUpOffAltButton = styled(ThumbUpOffAltIcon)`
  ${IconStyle}
`;
export const ThumbDownAltIconButton = styled(ThumbDownAltIcon)`
  ${IconStyle}
`;

export const ThumbDownOffAltButton = styled(ThumbDownOffAltIcon)`
  ${IconStyle}
`;

export const EvaluationBlock = styled.div`
  display: flex;
  border-radius: 1.8rem;
  margin-right: 1rem;
`;

export const DislikeCounts = styled.p`
  line-height: 40px;
  color: #fff;
  font-size: 1.4rem;
`;

export const LikeCounts = styled.p`
  line-height: 40px;
  color: #fff;
  font-size: 1.4rem;
`;

export const Like = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding-right: 1.5rem;
  padding-left: 0.5rem;
  border-top-left-radius: 1.8rem;
  border-bottom-left-radius: 1.8rem;
  background-color: rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }

  &::after {
    content: "";
    position: absolute;
    width: 1px;
    height: 70%;
    background-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-50%);
    border: 0;
    right: 0;
    top: 50%;
  }
`;

export const Dislike = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 0.5rem;
  padding-right: 1.5rem;
  border-top-right-radius: 1.8rem;
  border-bottom-right-radius: 1.8rem;
  background-color: rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;