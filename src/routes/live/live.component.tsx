import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import styled, { css } from "styled-components";
import _ from "lodash-es";

import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

import Chatroom from "@/components/chatroom/chatroom.component";
import VideoPlayer from "@/components/video-player/video-player.component";
import ChannelInfo from "@/components/channel-detail/channel-detail.component";

import { StyledContentEditable } from "@/components/send-message/send-message.style";

import { getStream } from "@/api/stream";

import useResizeObserver from "@/hooks/useResizeObserver";

import { Container } from "./live.style";

const IconStyle = css`
  padding: 8px 0;
  width: 40px;
  height: 40px;
  color: #fff;
`;

const ThumbUpAltIconButton = styled(ThumbUpAltIcon)`
  ${IconStyle}
`;

const ThumbUpOffAltIconButton = styled(ThumbUpOffAltIcon)`
  ${IconStyle}
`;

const StyledThumbDownAltIcon = styled(ThumbDownAltIcon)`
  ${IconStyle}
`;

const StyledThumbDownOffAltIcon = styled(ThumbDownOffAltIcon)`
  ${IconStyle}
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

const Body = styled.div`
  flex-grow: 1;
  color: white;
`;

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

const EvaluationBlock = styled.div`
  display: flex;
  border-radius: 1.8rem;
  margin-right: 1rem;
`;

const LikeCounts = styled.p`
  line-height: 40px;
  color: #fff;
  font-size: 1.4rem;
`;

const Like = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding-right: 1.5rem;
  padding-left: 0.5rem;
  border-top-left-radius: 1.8rem;
  border-bottom-left-radius: 1.8rem;
  background-color: rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }

  &::after {
    content: "";
    position: absolute;
    width: 1px;
    height: 70%;
    background-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-50%);
    border: 0;
    right: 0;
    top: 50%;
  }
`;

const Dislike = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  border-top-right-radius: 1.8rem;
  border-bottom-right-radius: 1.8rem;
  background-color: rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

export interface IStreamMeta {
  stream: {
    isStreamOn: boolean;
    title: string;
    content: string;
    author: string;
    videoId: string;
  };
  user: {
    avatar: string;
    subscribes: string;
  };
}

const initialStreamData = {
  stream: {
    isStreamOn: false,
    title: "string",
    content: "string",
    author: "string",
    videoId: "string",
  },
  user: {
    avatar: "string",
    subscribes: "string",
  },
};

const Live = () => {
  const { username } = useParams() as { username: string };
  const [streamMeta, setStreamMeta] = useState<IStreamMeta>(initialStreamData);
  const [message, setMessage] = useState("");

  const {
    stream: { isStreamOn, title, content, author, videoId },
    user: { avatar, subscribes },
  } = streamMeta;
  // const { ref: containerRef, dimensions } = useResizeObserver();

  useEffect(() => {
    const fetchStreamData = async () => {
      try {
        const { data } = await getStream(username);

        if (!data) return;

        setStreamMeta(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchStreamData();
  }, [username]);

  const handlePaste: React.ClipboardEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    const clipboardData = e.clipboardData;
    const text = clipboardData.getData("text/plain");
    const selection = window.getSelection();
    if (!selection) return;

    const range = selection.getRangeAt(0);

    // Insert the modified text into the contenteditable div
    range.deleteContents();
    range.insertNode(document.createTextNode(text));
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
  };

  return (
    <Container>
      <Body>
        <VideoPlayer videoId={videoId} />
        {/* {dimensions && dimensions.width < 1000 && ( */}
          <Chatroom setStream={setStreamMeta} roomName={username} />
        {/* )} */}
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
              <EvaluationBlock>
                <Like>
                  <ThumbUpAltIconButton />
                  <LikeCounts>3333</LikeCounts>
                </Like>
                <Dislike>
                  <StyledThumbDownOffAltIcon />
                </Dislike>
              </EvaluationBlock>
              <MoreHorizIconButton />
            </FeedbackMeta>
          </ActionRow>
          <ChannelInfo content={content} />
        </Meta>
      </Body>
      {/* {dimensions && dimensions.width >= 1000 && (
        <Chatroom setStream={setStreamMeta} roomName={username} />
      )} */}
    </Container>
  );
};

export default Live;
