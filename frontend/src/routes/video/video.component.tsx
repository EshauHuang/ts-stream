import { useState, useEffect, useContext } from "react";
import styled, { css } from "styled-components";
import { useParams } from "react-router-dom";

import { getVideo } from "@/api/stream";
import { UserContext } from "@/contexts/userContext";
import { CommentsContext, IComment } from "@/contexts/commentsContext";

import ChannelInfo from "@/components/channel-detail/channel-detail.component";
import VideoEvaluation from "@/components/video-evaluation/video-evaluation.component";
import Chatroom from "@/components/chatroom/chatroom.component";
import VideoPlayer from "@/components/video-player/video-player.component";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

import {
  addLikeToVideo,
  getUser,
  removeFromLikeVideoList,
  addDislikeVideoToList,
  removeFromDislikeVideoList,
} from "@/api/stream";

import useWindowResize from "@/hooks/useWindowResize";

import { Container } from "./video.style";

const IconStyle = css`
  padding: 8px 0;
  width: 40px;
  height: 40px;
  color: #fff;
`;

const MoreHorizIconButton = styled(MoreHorizIcon)`
  ${IconStyle}
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 50%;

  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

const Primary = styled.div`
  flex-grow: 1;
  color: white;
`;

const Secondary = styled.div``;

const Title = styled.h1`
  font-size: 2rem;
  color: #fff;
`;

const Meta = styled.div`
  padding: 1rem;
`;

const ActionRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ChannelMeta = styled.div`
  display: flex;
  align-items: center;
`;

const UserLink = styled.a`
  padding-right: 0.8rem;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const UserMeta = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  padding: 4px 0;
  margin-right: 2.4rem;
`;

const Author = styled.div`
  color: white;
  font-size: 1.6rem;
`;

const Subscribe = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.2rem;
`;

const SubscribeButton = styled.button`
  background-color: rgba(255, 255, 255, 1);
  color: black;
  padding: 0 1.6rem;
  height: 3.6rem;
  line-height: 3.6rem;
  border-radius: 1.8rem;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background-color: rgba(255, 255, 255, 0.8);
  }
`;

const FeedbackMeta = styled.div`
  display: flex;
  align-items: center;
`;

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
                  <img src={avatar} />
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
