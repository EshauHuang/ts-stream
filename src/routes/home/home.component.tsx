import styled from "styled-components";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import img1 from "/1.jpg";
import img2 from "/2.jpg";
import img3 from "/3.jpg";
import img4 from "/4.jpg";
import img5 from "/5.jpg";

import { getStreams, getVideos } from "@/api/stream";

type Video = {
  id: string;
  title: string;
  author: string;
  content: string;
  thumbnail: string;
};

const Container = styled.div`
  background-color: #333;
`;

const VideoList = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const VideoItem = styled.div`
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

const Thumbnail = styled.div`
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

const Detail = styled.div`
  display: flex;
  padding: 12px 12px 0 0;
`;

const Meta = styled.div`
  margin-left: 12px;
  color: white;
`;

const MetaBottomLine = styled.div`
  display: flex;
`;

const VideoTitle = styled.h3`
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

const Avatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const VideoAuthor = styled.div`
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

const Home = () => {
  const [videos, setVideo] = useState([]);

  useEffect(() => {
    const fetchStreams = async () => {
      try {
        const { videos } = await getVideos(1, 20);

        setVideo(videos);
      } catch (err) {
        console.log(err);
      }
    };


    fetchStreams();
  }, []);

  return (
    <Container>
      <VideoList>
        {videos.map((video: Video) => (
          <VideoItem key={`${video.id}`}>
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
          </VideoItem>
        ))}
      </VideoList>
    </Container>
  );
};

export default Home;
