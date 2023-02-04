import { useEffect } from "react";
import { useParams } from "react-router-dom"

import Chatroom from "@/components/chatroom/chatroom.component";
import VideoPlayer from "@/components/video-player/video-player.component";

import { Container } from "./video.style";

const Video = () => {
  const { videoId } = useParams() as { videoId: string };

  useEffect(() => {}, []);
  return (
    <Container>
      <VideoPlayer videoId={videoId} />
      <Chatroom />
    </Container>
  );
};

export default Video;
