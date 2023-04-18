import styled from "styled-components";
import { useEffect, useState } from "react";

import { getStreams, getVideos } from "@/api/stream";
import VideoCard from "@/components/video-card/video-card.component";

import { IVideoCard } from "@/components/video-card/video-card.component";

const Container = styled.div`
  background-color: #0f0f0f;
`;

const VideoList = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const CategoriesList = styled.div`
  display: flex;
  width: 97%;
  margin: 0 auto;
  gap: 1rem;
  padding: 2rem 0;
`;

const CategoryItem = styled.div<{ isTarget: boolean }>`
  padding: 1rem 1.5rem;
  background-color: ${({ isTarget }) =>
    isTarget ? "#fff" : "rgba(255, 255, 255, 0.1)"};
  color: ${({ isTarget }) => (isTarget ? "#000" : "#f1f1f1;")};
  border-radius: 0.8rem;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;

  &:hover {
    background-color: ${({ isTarget }) =>
      isTarget ? "#fff" : "rgba(255, 255, 255, 0.2)"};
  }
`;

const Home = () => {
  const [videos, setVideo] = useState([]);
  const [tabName, setTabName] = useState("video");

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const { videos } = await getVideos(1, 20);

        console.log({ videos });

        setVideo(videos);
      } catch (err) {
        console.log(err);
      }
    };
    const fetchStreams = async () => {
      try {
        const { streams } = await getStreams(1, 20);

        setVideo(streams);
      } catch (err) {
        console.log(err);
      }
    };
    switch (tabName) {
      case "video":
        fetchVideos();
        break;
      case "stream":
        fetchStreams();
      default:
        break;
    }
  }, [tabName]);

  return (
    <Container>
      <CategoriesList>
        <CategoryItem
          isTarget={tabName === "all"}
          onClick={() => setTabName("all")}
        >
          全部
        </CategoryItem>
        <CategoryItem
          isTarget={tabName === "video"}
          onClick={() => setTabName("video")}
        >
          影片
        </CategoryItem>
        <CategoryItem
          isTarget={tabName === "stream"}
          onClick={() => setTabName("stream")}
        >
          直播中
        </CategoryItem>
      </CategoriesList>
      <VideoList>
        {videos.map((video: IVideoCard, index: number) => (
          <VideoCard video={video} key={`${index}`} />
        ))}
      </VideoList>
    </Container>
  );
};

export default Home;
