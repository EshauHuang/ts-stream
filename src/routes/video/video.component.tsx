import { useEffect } from "react";
import { useParams } from "react-router-dom";

import Chatroom from "@/components/chatroom/chatroom.component";
import VideoPlayer from "@/components/video-player/video-player.component";

import { getVideo } from "@/api/stream";

import { Container } from "./video.style";

const Video = () => {
  const { videoId } = useParams() as { videoId: string };

  useEffect(() => {
    const fetchVideoData = async () => {
      const data = await getVideo(videoId);

      console.log({ data });
    };

    fetchVideoData();
  }, []);
  return (
    <Container>
      <VideoPlayer />
      <Chatroom />
    </Container>
  );
};

export default Video;
