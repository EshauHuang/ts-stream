import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import Chatroom from "@/components/chatroom/chatroom.component";
import VideoPlayer from "@/components/video-player/video-player.component";
import { getVideo, getComments } from "@/api/stream";

import { IVideo } from "@/components/video-card/video-card.component";

import { Container } from "./video.style";

const initialVideo = {
  id: "",
  type: "",
  title: "",
  author: "",
  content: "",
  thumbnail: "",
  startTime: undefined,
  comments: [],
};

const Video = () => {
  const { videoId } = useParams() as { videoId: string };
  const [video, setVideo] = useState<IVideo>(initialVideo);

  useEffect(() => {
    const fetchVideoData = async () => {
      const { video } = await getVideo(videoId);

      if (video) {
        setVideo(video);
      }
    };

    fetchVideoData();
  }, []);

  return (
    <Container>
      <VideoPlayer isLive={false} videoId={videoId} />
      <Chatroom comments={video.comments} isLive={false} />
    </Container>
  );
};

export default Video;
