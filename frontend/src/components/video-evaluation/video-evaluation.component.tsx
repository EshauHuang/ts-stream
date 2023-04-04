import styled, { css } from "styled-components";

import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";

const IconStyle = css`
  padding: 8px 0;
  width: 40px;
  height: 40px;
  color: #fff;
`;

const ThumbUpAltIconButton = styled(ThumbUpAltIcon)`
  ${IconStyle}
`;

const ThumbUpOffAltButton = styled(ThumbUpOffAltIcon)`
  ${IconStyle}
`;
const ThumbDownAltIconButton = styled(ThumbDownAltIcon)`
  ${IconStyle}
`;

const ThumbDownOffAltButton = styled(ThumbDownOffAltIcon)`
  ${IconStyle}
`;

const EvaluationBlock = styled.div`
  display: flex;
  border-radius: 1.8rem;
  margin-right: 1rem;
`;

const DislikeCounts = styled.p`
  line-height: 40px;
  color: #fff;
  font-size: 1.4rem;
`;

const LikeCounts = styled.p`
  line-height: 40px;
  color: #fff;
  font-size: 1.4rem;
`;

const Like = styled.div`
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

const Dislike = styled.div`
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

const VideoEvaluation = ({
  like,
  isLikeVideo,
  isDislikeVideo,
  dislike,
  handleClickLike,
  handleClickDislike,
}: {
  like: number;
  isLikeVideo: boolean;
  isDislikeVideo: boolean;
  dislike: number;
  handleClickLike: () => void;
  handleClickDislike: () => void;
}) => {
  return (
    <EvaluationBlock>
      <Like onClick={handleClickLike}>
        {isLikeVideo ? <ThumbUpAltIconButton /> : <ThumbUpOffAltButton />}
        <LikeCounts>{like}</LikeCounts>
      </Like>
      <Dislike onClick={handleClickDislike}>
        {isDislikeVideo ? (
          <ThumbDownAltIconButton />
        ) : (
          <ThumbDownOffAltButton />
        )}
        <DislikeCounts>{dislike}</DislikeCounts>
      </Dislike>
    </EvaluationBlock>
  );
};

export default VideoEvaluation;
