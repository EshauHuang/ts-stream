import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";

import { getVideo } from "@/api/stream";
import { CommentsContext } from "@/contexts/commentsContext";

import Chatroom from "@/components/chatroom/chatroom.component";
import VideoPlayer from "@/components/video-player/video-player.component";
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
  const { setVideoStartTime } = useContext(CommentsContext);

  useEffect(() => {
    const fetchVideoData = async () => {
      const { video } = await getVideo(videoId);

      if (video) {
        setVideo(video);
        setVideoStartTime(video.startTime);
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
