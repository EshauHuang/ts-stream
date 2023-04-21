import { Link } from "react-router-dom";

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
  author: {
    username: string;
    nickname: string;
  };
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

  console.log(video);

  return (
    <StyledVideoCard key={`${video.id}`}>
      <Link to={linkUrl}>
        {
          <Thumbnail>
            {video.thumbnail ? (
              <img
                src={`${import.meta.env.VITE_API_SERVER_URL}${video.thumbnail}`}
              />
            ) : (
              <img src="images/3.jpg" />
            )}
          </Thumbnail>
        }
      </Link>
      <Detail>
        <Avatar>
          <AvatarImage src={img5} />
        </Avatar>
        <Meta>
          <Link to={linkUrl}>
            <VideoTitle>{video.title}</VideoTitle>
          </Link>
          <VideoAuthor>{video.author.nickname}</VideoAuthor>
          <MetaBottomLine></MetaBottomLine>
        </Meta>
      </Detail>
    </StyledVideoCard>
  );
};

export default VideoCard;
