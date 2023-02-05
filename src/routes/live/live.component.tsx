import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Chatroom from "@/components/chatroom/chatroom.component";
import VideoPlayer from "@/components/video-player/video-player.component";

import { getStream } from "@/api/stream";

import { Container } from "./live.style";

export interface IStreamData {
  isStreamOn: boolean;
  title: string;
  content: string;
  videoId: string;
}

const initialStreamData = {
  isStreamOn: false,
  title: "",
  content: "",
  videoId: ""
};

const Live = () => {
  const { username } = useParams() as { username: string };
  const [stream, setStream] = useState<IStreamData>(initialStreamData);
  const { isStreamOn, title, content, videoId } = stream;

  useEffect(() => {
    const fetchStreamData = async () => {
      try {
        const data = await getStream(username);
        setStream(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchStreamData();
  }, [username]);

  return (
    <Container>
      <VideoPlayer videoId={videoId} />
      <Chatroom setStream={setStream} roomName={username} />
    </Container>
  );
};

export default Live;
