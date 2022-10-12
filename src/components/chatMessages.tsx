import { useContext, useEffect, useRef } from "react";
import styled from "styled-components";

import { MessagesContext } from "@/contexts/messagesContext";

import ChatMessage from "@/components/chatMessage";

const Container = styled.div`
  width: 100%;
  min-height: 20px;
  height: 420px;
  overflow-y: scroll;
  background-color: #333;
`;

const ChatMessages = () => {
  const { currentMessages } = useContext(MessagesContext);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView();
  }, [currentMessages]);

  return (
    <Container>
      {currentMessages.map((data) => (
        <ChatMessage key={`chat-${data.id}`} {...data} />
      ))}
      <div ref={bottomRef}></div>
    </Container>
  );
};

export default ChatMessages;
