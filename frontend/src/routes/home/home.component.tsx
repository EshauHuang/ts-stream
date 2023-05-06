import { useEffect, useState } from "react";

import { getStreams, getVideos } from "@/api/stream";

import VideoCard, {
  IVideoCard,
} from "@/components/video-card/video-card.component";

import {
  Container,
  CategoriesList,
  CategoryItem,
  VideoList,
} from "./home.style";

const Home = () => {
  const [videos, setVideo] = useState([]);
  const [tabName, setTabName] = useState("video");

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const { videos } = await getVideos(1, 20);

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
        {/* <CategoryItem
          isTarget={tabName === "all"}
          onClick={() => setTabName("all")}
        >
          全部
        </CategoryItem> */}
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
