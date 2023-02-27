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


const VideoCard = ({ video }) => {
  return (
    <StyledVideoCard key={`${video.id}`}>
      <Link to={`/video/${video.id}`}>
        <Thumbnail>
          <img src={video.thumbnail} />
        </Thumbnail>
      </Link>
      <Detail>
        <Avatar>
          <AvatarImage src={img5} />
        </Avatar>
        <Meta>
          <Link to={`/video/${video.id}`}>
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