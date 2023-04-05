import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import styled, { css } from "styled-components";
import _ from "lodash-es";

import { UserContext } from "@/contexts/userContext";

import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

import Chatroom from "@/components/chatroom/chatroom.component";
import VideoPlayer from "@/components/video-player/video-player.component";
import ChannelInfo from "@/components/channel-detail/channel-detail.component";
import VideoEvaluation from "@/components/video-evaluation/video-evaluation.component";

import { StyledContentEditable } from "@/components/send-message/send-message.style";

import {
  getStream,
  addToLikeStream,
  getMe,
  removeFromLikeStream,
  addToDislikeStream,
  removeFromDislikeStream,
} from "@/api/stream";

import { Container } from "./live.style";
import useWindowResize from "@/hooks/useWindowResize";
import { CatchingPokemon } from "@mui/icons-material";

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
    author: string;
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

export interface IStreamData {
  stream: {
    isStreamOn: boolean;
    title: string;
    content: string;
    author: string;
    videoId: string;
    like: number;
    dislike: number;
  };
  user: {
    avatar: string;
    subscribes: number;
  };
}

const initialUserData = {
  stream: {
    isStreamOn: false,
    title: "",
    content: "",
    author: "",
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

const initialStreamData = {
  stream: {
    isStreamOn: false,
    title: "",
    content: "",
    author: "",
    videoId: "",
    like: 0,
    dislike: 0,
  },
  user: {
    avatar: "",
    subscribes: 0,
  },
};

const Live = () => {
  const { username } = useParams() as { username: string };
  const [streamData, setStreamData] = useState<IStreamData>(initialStreamData);
  const [currentUserData, setCurrentUserData] =
    useState<IUserData>(initialUserData);
  const { currentUser } = useContext(UserContext);

  const {
    stream: { isStreamOn, title, content, author, videoId, like, dislike },
    user: { avatar, subscribes },
  } = streamData;

  const {
    user: { likeVideoList, dislikeVideoList },
  } = currentUserData;

  const isDislikeVideo =
    !!dislikeVideoList.length &&
    !!dislikeVideoList.find((id) => id === videoId);

  const isLikeVideo =
    !!likeVideoList.length && !!likeVideoList.find((id) => id === videoId);

  const { dimensions } = useWindowResize();

  useEffect(() => {
    try {
      const fetchStreamData = async () => {
        const { data } = await getStream(username);

        if (!data) return;

        setStreamData(data);
      };

      const fetchMyData = async () => {
        if (!currentUser) return;
        const { data } = await getMe(currentUser.username);

        if (!data) return;
        setCurrentUserData(data);
      };

      fetchStreamData();
      fetchMyData();
    } catch (error) {
      console.log(error);
    }
  }, [username]);

  const handleClickDislike = async () => {
    if (!currentUser) return;

    if (isDislikeVideo) {
      const { dislike, dislikeVideoList } = await removeFromDislikeStream(
        username,
        currentUser
      );

      setCurrentUserData((prev) => ({
        ...prev,
        user: {
          ...prev.user,
          dislikeVideoList,
        },
      }));

      setStreamData((prev) => ({
        ...prev,
        stream: {
          ...prev.stream,
          dislike,
        },
      }));
    } else if (isLikeVideo) {
      const { dislike, dislikeVideoList } = await addToDislikeStream(
        username,
        currentUser
      );

      const { like, likeVideoList } = await removeFromLikeStream(
        username,
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

      setStreamData((prev) => ({
        ...prev,
        stream: {
          ...prev.stream,
          like,
          dislike,
        },
      }));
    } else {
      const { dislike, dislikeVideoList } = await addToDislikeStream(
        username,
        currentUser
      );

      setCurrentUserData((prev) => ({
        ...prev,
        user: {
          ...prev.user,
          dislikeVideoList,
        },
      }));

      setStreamData((prev) => ({
        ...prev,
        stream: {
          ...prev.stream,
          dislike,
        },
      }));
    }
  };

  const handleClickLike = async () => {
    if (!currentUser) return;

    if (isLikeVideo) {
      const { like, likeVideoList } = await removeFromLikeStream(
        username,
        currentUser
      );

      setCurrentUserData((prev) => ({
        ...prev,
        user: {
          ...prev.user,
          likeVideoList,
        },
      }));

      setStreamData((prev) => ({
        ...prev,
        stream: {
          ...prev.stream,
          like,
        },
      }));
    } else if (isDislikeVideo) {
      const { like, likeVideoList } = await addToLikeStream(
        username,
        currentUser
      );

      const { dislike, dislikeVideoList } = await removeFromDislikeStream(
        username,
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

      setStreamData((prev) => ({
        ...prev,
        stream: {
          ...prev.stream,
          like,
          dislike,
        },
      }));
    } else {
      const { like, likeVideoList } = await addToLikeStream(
        username,
        currentUser
      );

      setCurrentUserData((prev) => ({
        ...prev,
        user: {
          ...prev.user,
          likeVideoList,
        },
      }));

      setStreamData((prev) => ({
        ...prev,
        stream: {
          ...prev.stream,
          like,
        },
      }));
    }
  };

  return (
    <Container>
      <Primary>
        <VideoPlayer videoId={videoId} isLive={true} />
        {dimensions && dimensions.width < 1030 && (
          <Chatroom
            setStream={setStreamData}
            roomName={username}
            isLive={true}
          />
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
                <Author>{author}</Author>
                <Subscribe>{subscribes} 訂閱者</Subscribe>
              </UserMeta>
              <SubscribeButton>訂閱</SubscribeButton>
            </ChannelMeta>
            <FeedbackMeta>
              {isStreamOn && (
                <VideoEvaluation
                  like={like}
                  isLikeVideo={isLikeVideo}
                  isDislikeVideo={isDislikeVideo}
                  dislike={dislike}
                  handleClickLike={handleClickLike}
                  handleClickDislike={handleClickDislike}
                />
              )}
              <MoreHorizIconButton />
            </FeedbackMeta>
          </ActionRow>
          <ChannelInfo content={content} />
        </Meta>
      </Primary>
      <Secondary>
        {dimensions && dimensions.width >= 1030 && (
          <Chatroom
            setStream={setStreamData}
            roomName={username}
            isLive={true}
          />
        )}
      </Secondary>
    </Container>
  );
};

export default Live;
