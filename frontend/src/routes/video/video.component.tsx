import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";

import { getVideo } from "@/api/stream";
import { UserContext } from "@/contexts/userContext";
import { CommentsContext, IComment } from "@/contexts/commentsContext";

import ChannelInfo from "@/components/channel-detail/channel-detail.component";
import VideoEvaluation from "@/components/video-evaluation/video-evaluation.component";
import Chatroom from "@/components/chatroom/chatroom.component";
import VideoPlayer from "@/components/video-player/video-player.component";

import {
  addLikeToVideo,
  getUser,
  removeFromLikeVideoList,
  addDislikeVideoToList,
  removeFromDislikeVideoList,
} from "@/api/stream";

import useWindowResize from "@/hooks/useWindowResize";

import {
  Container,
  Primary,
  Meta,
  Title,
  ActionRow,
  ChannelMeta,
  UserLink,
  Avatar,
  UserMeta,
  Author,
  Subscribe,
  FeedbackMeta,
  MoreHorizIconButton,
  SubscribeButton,
  Secondary,
} from "./video.style";

import { StyledAccountCircleIcon } from "@/components/ui/icon.style";

export interface IUserData {
  stream: {
    isStreamOn: boolean;
    title: string;
    content: string;
    author: {
      username: string;
      nickname: string;
    };
    videoId: string;
    like: number;
    dislike: number;
  };
  user: {
    avatar: string;
    likeVideoList: string[];
    dislikeVideoList: string[];
    subscribes: number;
  };
}

export interface IVideoData {
  video: {
    title: string;
    content: string;
    author: {
      username: string;
      nickname: string;
    };
    videoId: string;
    like: number;
    dislike: number;
    avatar: string;
    subscribes: number;
    comments: IComment[];
  };
  user: {
    avatar: string;
    subscribes: number;
    username: string;
  };
}

const initialUserData = {
  stream: {
    isStreamOn: false,
    title: "",
    content: "",
    author: {
      username: "",
      nickname: "",
    },
    videoId: "",
    like: 0,
    dislike: 0,
  },
  user: {
    likeVideoList: [],
    dislikeVideoList: [],
    avatar: "",
    subscribes: 0,
  },
};

const initialVideoData = {
  video: {
    title: "",
    content: "",
    author: {
      username: "",
      nickname: "",
    },
    videoId: "",
    like: 0,
    dislike: 0,
    avatar: "",
    subscribes: 0,
    comments: [],
  },
  user: {
    avatar: "",
    subscribes: 0,
    username: "",
  },
};

const Video = () => {
  const { videoId } = useParams() as { videoId: string };
  const [videoData, setVideoData] = useState<IVideoData>(initialVideoData);
  const { setVideoStartTime } = useContext(CommentsContext);
  const [currentUserData, setCurrentUserData] =
    useState<IUserData>(initialUserData);
  const { currentUser } = useContext(UserContext);

  const {
    video: { title, comments, author, like, dislike, content },
    user: { avatar, subscribes },
  } = videoData;

  const {
    user: { likeVideoList, dislikeVideoList },
  } = currentUserData;

  const isDislikeVideo =
    !!dislikeVideoList &&
    !!dislikeVideoList.length &&
    !!dislikeVideoList.find((id) => id === videoId);

  const isLikeVideo =
    !!likeVideoList &&
    !!likeVideoList.length &&
    !!likeVideoList.find((id) => id === videoId);

  const { dimensions } = useWindowResize();

  useEffect(() => {
    const fetchVideoData = async () => {
      const { data } = await getVideo(videoId);

      if (data) {
        setVideoData(data);
        setVideoStartTime(data.video.startTime);
      }
    };

    const fetchMyData = async () => {
      if (!currentUser) return;
      const { data } = await getUser(currentUser.username);

      if (!data) return;
      setCurrentUserData(data);
    };

    fetchVideoData();
    fetchMyData();
  }, []);

  const handleClickDislike = async () => {
    if (!currentUser) return;

    if (isDislikeVideo) {
      const { dislike, dislikeVideoList } = await removeFromDislikeVideoList(
        videoId,
        currentUser
      );

      setCurrentUserData((prev) => ({
        ...prev,
        user: {
          ...prev.user,
          dislikeVideoList,
        },
      }));

      setVideoData((prev) => ({
        ...prev,
        video: {
          ...prev.video,
          dislike,
        },
      }));
    } else if (isLikeVideo) {
      const { dislike, dislikeVideoList } = await addDislikeVideoToList(
        videoId,
        currentUser
      );

      const { like, likeVideoList } = await removeFromLikeVideoList(
        videoId,
        currentUser
      );

      setCurrentUserData((prev) => ({
        ...prev,
        user: {
          ...prev.user,
          likeVideoList,
          dislikeVideoList,
        },
      }));

      setVideoData((prev) => ({
        ...prev,
        video: {
          ...prev.video,
          like,
          dislike,
        },
      }));
    } else {
      const { dislike, dislikeVideoList } = await addDislikeVideoToList(
        videoId,
        currentUser
      );

      setCurrentUserData((prev) => ({
        ...prev,
        user: {
          ...prev.user,
          dislikeVideoList,
        },
      }));

      setVideoData((prev) => ({
        ...prev,
        video: {
          ...prev.video,
          dislike,
        },
      }));
    }
  };

  const handleClickLike = async () => {
    if (!currentUser) return;

    if (isLikeVideo) {
      const { like, likeVideoList } = await removeFromLikeVideoList(
        videoId,
        currentUser
      );

      setCurrentUserData((prev) => ({
        ...prev,
        user: {
          ...prev.user,
          likeVideoList,
        },
      }));

      setVideoData((prev) => ({
        ...prev,
        video: {
          ...prev.video,
          like,
        },
      }));
    } else if (isDislikeVideo) {
      const { like, likeVideoList } = await addLikeToVideo(
        videoId,
        currentUser
      );

      const { dislike, dislikeVideoList } = await removeFromDislikeVideoList(
        videoId,
        currentUser
      );

      setCurrentUserData((prev) => ({
        ...prev,
        user: {
          ...prev.user,
          likeVideoList,
          dislikeVideoList,
        },
      }));

      setVideoData((prev) => ({
        ...prev,
        video: {
          ...prev.video,
          like,
          dislike,
        },
      }));
    } else {
      const { like, likeVideoList } = await addLikeToVideo(
        videoId,
        currentUser
      );

      setCurrentUserData((prev) => ({
        ...prev,
        user: {
          ...prev.user,
          likeVideoList,
        },
      }));

      setVideoData((prev) => ({
        ...prev,
        video: {
          ...prev.video,
          like,
        },
      }));
    }
  };

  const avatarUrl = avatar
    ? `${import.meta.env.VITE_API_SERVER_URL}${avatar}`
    : "";

  return (
    <Container>
      <Primary>
        <VideoPlayer videoId={videoId} isLive={false} />
        {dimensions && dimensions.width < 1030 && (
          <Chatroom comments={comments} isLive={false} />
        )}
        <Meta>
          <Title>{title}</Title>
          <ActionRow>
            <ChannelMeta>
              <UserLink>
                <Avatar>
                  {avatarUrl ? (
                    <img src={avatarUrl} />
                  ) : (
                    <StyledAccountCircleIcon />
                  )}
                </Avatar>
              </UserLink>
              <UserMeta>
                <Author>{author.nickname}</Author>
                <Subscribe>{subscribes} 訂閱者</Subscribe>
              </UserMeta>
              <SubscribeButton>訂閱</SubscribeButton>
            </ChannelMeta>
            <FeedbackMeta>
              <VideoEvaluation
                like={like}
                isLikeVideo={isLikeVideo}
                isDislikeVideo={isDislikeVideo}
                dislike={dislike}
                handleClickLike={handleClickLike}
                handleClickDislike={handleClickDislike}
              />
              <MoreHorizIconButton />
            </FeedbackMeta>
          </ActionRow>
          <ChannelInfo content={content} />
        </Meta>
      </Primary>
      <Secondary>
        {dimensions && dimensions.width >= 1030 && (
          <Chatroom comments={comments} isLive={false} />
        )}
      </Secondary>
    </Container>
  );
};

export default Video;
