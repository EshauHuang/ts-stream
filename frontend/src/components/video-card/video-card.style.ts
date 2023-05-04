import styled from "styled-components";

export const StyledVideoCard = styled.div`
  --videos-row-count: 3;
  --video-col-margin: 1.2;

  width: calc(
    (
        100% -
          calc((var(--videos-row-count) + 1) * var(--video-col-margin) * 1rem)
      ) / var(--videos-row-count)
  );
  margin-left: calc(var(--video-col-margin) * 1rem);
  margin-top: 1.5rem;
  /* background-color: #ccc; */

  @media (max-width: 900px) {
    --videos-row-count: 2;
    --video-col-margin: 1;
  }

  @media (max-width: 500px) {
    --videos-row-count: 1;
    --video-col-margin: 0;
  }
`;

export const Thumbnail = styled.div`
  width: 100%;
  aspect-ratio: 2/1;

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    background-color: transparent;
  }
`;

export const Detail = styled.div`
  display: flex;
  padding: 12px 12px 0 0;
`;

export const Meta = styled.div`
  margin-left: 12px;
  color: white;
`;

export const MetaBottomLine = styled.div`
  display: flex;
`;

export const VideoTitle = styled.h3`
  --max-lines: 2;

  color: white;
  font-size: 1.4rem;
  line-height: 2rem;
  font-weight: 500;
  max-height: 4rem;
  overflow: hidden;
  -webkit-line-clamp: var(--max-lines);
  display: -webkit-box;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  white-space: normal;
`;

export const Avatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
`;

export const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const VideoAuthor = styled.div`
  --max-lines: 1;

  font-size: 1.4rem;
  line-height: 2rem;
  font-weight: 500;
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: var(--max-lines);
  -webkit-box-orient: vertical;
`;
