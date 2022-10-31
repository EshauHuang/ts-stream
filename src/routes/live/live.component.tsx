import Chatroom from "@/components/chatroom/chatroom.component";
import VideoPlayer from "@/components/video-player/video-player.component";

import { Container } from "./live.style";

const Live = () => {
  return (
    <Container>
      <VideoPlayer />
      <Chatroom />
    </Container>
  );
};

export default Live;
