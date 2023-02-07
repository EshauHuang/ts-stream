import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import Chatroom from "@/components/chatroom/chatroom.component";
import VideoPlayer from "@/components/video-player/video-player.component";

import { getVideo, getComments } from "@/api/stream";

import { IComment } from "@/contexts/commentsContext";

import { Container } from "./video.style";

interface IVideo {
  title: string;
  content: string;
  comments: IComment[];
}

const initialVideo = {
  title: "",
  content: "",
  comments: [],
};

const Video = () => {
  const { videoId } = useParams() as { videoId: string };
  const [video, setVideo] = useState<IVideo>(initialVideo);

  useEffect(() => {
    const fetchVideoData = async () => {
      const { video } = await getVideo(videoId);
      const { comments } = await getComments(videoId);
      console.log({ video });

      if (video) {
        console.log("video", video.comments);
        setVideo(video);
      }
    };

    fetchVideoData();
  }, []);
  return (
    <Container>
      <VideoPlayer videoId={videoId}/>
      <Chatroom comments={video.comments} />
    </Container>
  );
};

export default Video;
