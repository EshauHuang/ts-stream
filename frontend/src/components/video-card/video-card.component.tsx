import { Link } from "react-router-dom";

import { IComment } from "@/contexts/commentsContext";

import {
  StyledVideoCard,
  Thumbnail,
  Detail,
  Avatar,
  AvatarImage,
  VideoAuthor,
  VideoTitle,
  MetaBottomLine,
  Meta,
} from "./video-card.style";

import img5 from "/images/5.jpg";

export interface IVideoCard {
  id: string;
  type: string;
  title: string;
  author: string;
  content: string;
  thumbnail: string;
  startTime?: number;
}

const VideoCard = ({ video }: { video: IVideoCard }) => {
  const getLinkUrl = (video: IVideoCard) => {
    const { type, id, author } = video;
    switch (type) {
      case "video":
        return `/video/${id}`;
      case "stream":
        return `/live/${author}`;
      default:
        return "";
    }
  };
  const linkUrl = getLinkUrl(video);

  return (
    <StyledVideoCard key={`${video.id}`}>
      <Link to={linkUrl}>
        <Thumbnail>
          <img src={video.thumbnail} />
        </Thumbnail>
      </Link>
      <Detail>
        <Avatar>
          <AvatarImage src={img5} />
        </Avatar>
        <Meta>
          <Link to={linkUrl}>
            <VideoTitle>{video.title}</VideoTitle>
          </Link>
          <VideoAuthor>{video.author}</VideoAuthor>
          <MetaBottomLine></MetaBottomLine>
        </Meta>
      </Detail>
    </StyledVideoCard>
  );
};

export default VideoCard;
