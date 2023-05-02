import {
  ThumbUpAltIconButton,
  ThumbUpOffAltButton,
  ThumbDownAltIconButton,
  ThumbDownOffAltButton,
  EvaluationBlock,
  DislikeCounts,
  LikeCounts,
  Like,
  Dislike,
} from "./video-evaluation.style";

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
