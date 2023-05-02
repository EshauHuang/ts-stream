import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import _ from "lodash-es";

import { UserContext } from "@/contexts/userContext";

import Chatroom from "@/components/chatroom/chatroom.component";
import VideoPlayer from "@/components/video-player/video-player.component";
import ChannelInfo from "@/components/channel-detail/channel-detail.component";
import VideoEvaluation from "@/components/video-evaluation/video-evaluation.component";

import {
  getStream,
  getUser,
  addStreamToLikeList,
  removeStreamFromLikeList,
  addStreamToDislikeList,
  removeStreamFromDislikeList,
  addSubscribeToList,
  removeSubscribeFromList,
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
  SubscribeOnButton,
  SubscribeOffButton,
  Subscribe,
  FeedbackMeta,
  MoreHorizIconButton,
  Secondary,
} from "./live.style";

export interface IUserData {
  stream: {
    isStreamOn: boolean;
    title: string;
    content: string;
    author: {
      username: string;
      nickname: string;
    };
    thumbnail: string;
    videoId: string;
    like: number;
    dislike: number;
  };
  user: {
    avatar: string;
    likeVideoList: string[];
    dislikeVideoList: string[];
    subscribeList: string[];
    subscribes: number;
  };
}

export interface IStreamData {
  stream: {
    isStreamOn: boolean;
    title: string;
    content: string;
    author: {
      username: string;
      nickname: string;
    };
    thumbnail: string;
    videoId: string;
    like: number;
    dislike: number;
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
    thumbnail: "",
    videoId: "",
    like: 0,
    dislike: 0,
  },
  user: {
    likeVideoList: [],
    dislikeVideoList: [],
    subscribeList: [],
    avatar: "",
    subscribes: 0,
  },
};

const initialStreamData = {
  stream: {
    isStreamOn: false,
    title: "",
    content: "",
    author: {
      username: "",
      nickname: "",
    },
    thumbnail: "",
    videoId: "",
    like: 0,
    dislike: 0,
  },
  user: {
    avatar: "",
    subscribes: 0,
    username: "",
  },
};

const Live = () => {
  const { username } = useParams() as { username: string };
  const [streamData, setStreamData] = useState<IStreamData>(initialStreamData);
  const [currentUserData, setCurrentUserData] =
    useState<IUserData>(initialUserData);
  const { currentUser } = useContext(UserContext);

  const {
    stream: {
      isStreamOn,
      title,
      content,
      author,
      thumbnail,
      videoId,
      like,
      dislike,
    },
    user: { avatar, subscribes, username: authorUsername },
  } = streamData;

  const {
    user: { likeVideoList, dislikeVideoList, subscribeList },
  } = currentUserData;

  const isDislikeVideo =
    !!dislikeVideoList &&
    !!dislikeVideoList.length &&
    !!dislikeVideoList.find((id) => id === videoId);

  const isLikeVideo =
    !!likeVideoList &&
    !!likeVideoList.length &&
    !!likeVideoList.find((id) => id === videoId);

  const isSubscribe =
    !!subscribeList &&
    !!subscribeList.length &&
    !!subscribeList.find((username) => username === authorUsername);

  const { dimensions } = useWindowResize();

  useEffect(() => {
    try {
      const fetchStreamData = async () => {
        const { data } = await getStream(username);

        if (data) {
          setStreamData(data);
        }
      };

      const fetchMyData = async () => {
        if (!currentUser) return;
        const { data } = await getUser(currentUser.username);

        if (data) {
          setCurrentUserData(data);
        }
      };

      fetchStreamData();
      fetchMyData();
    } catch (error) {
      console.log(error);
    }
  }, [currentUser]);

  const handleClickDislike = async () => {
    if (!currentUser) return;

    if (isDislikeVideo) {
      const { dislike, dislikeVideoList } = await removeStreamFromDislikeList(
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
      const { dislike, dislikeVideoList } = await addStreamToDislikeList(
        username,
        currentUser
      );

      const { like, likeVideoList } = await removeStreamFromLikeList(
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
      const { dislike, dislikeVideoList } = await addStreamToDislikeList(
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
      const { like, likeVideoList } = await removeStreamFromLikeList(
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
      const { like, likeVideoList } = await addStreamToLikeList(
        username,
        currentUser
      );

      const { dislike, dislikeVideoList } = await removeStreamFromDislikeList(
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
      const { like, likeVideoList } = await addStreamToLikeList(
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
        <VideoPlayer thumbnail={thumbnail} videoId={videoId} isLive={true} />
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
                <Author>{author.nickname}</Author>
                <Subscribe>{subscribes} 訂閱者</Subscribe>
              </UserMeta>
              {isSubscribe ? (
                <SubscribeOffButton
                  onClick={async () => {
                    if (!currentUser) return;
                    const { subscribeList } = await removeSubscribeFromList(
                      authorUsername,
                      currentUser
                    );

                    setCurrentUserData((prev) => ({
                      ...prev,
                      user: {
                        ...prev.user,
                        subscribeList,
                      },
                    }));
                  }}
                >
                  已訂閱
                </SubscribeOffButton>
              ) : (
                <SubscribeOnButton
                  onClick={async () => {
                    if (!currentUser) return;
                    const { subscribeList } = await addSubscribeToList(
                      authorUsername,
                      currentUser
                    );

                    setCurrentUserData((prev) => ({
                      ...prev,
                      user: {
                        ...prev.user,
                        subscribeList,
                      },
                    }));
                  }}
                >
                  訂閱
                </SubscribeOnButton>
              )}
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
