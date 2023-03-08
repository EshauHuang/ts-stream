import { useContext, useEffect, useRef } from "react";

import { CommentsContext } from "@/contexts/commentsContext";

import ChatMessage from "@/components/chat-message/chat-message.component";
import { Container } from "./chat-messages.style";

const ChatMessages = () => {
  const { currentComments } = useContext(CommentsContext);
  const roomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const room = roomRef.current;

    if (!room) return;
    room.scrollTop = room.scrollHeight;
  }, [currentComments]);

  return (
    <Container ref={roomRef}>
      {currentComments.map((comment, index) => (
        <ChatMessage key={`${index}`} {...comment} />
      ))}
    </Container>
  );
};

export default ChatMessages;
