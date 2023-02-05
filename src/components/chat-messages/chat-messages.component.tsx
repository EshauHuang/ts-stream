import { useContext, useEffect, useRef } from "react";

import { CommentsContext } from "@/contexts/commentsContext";

import ChatMessage from "@/components/chat-message/chat-message.component";
import { Container } from "./chat-messages.style";

const ChatMessages = () => {
  const { currentComments } = useContext(CommentsContext);
  const bottomRef = useRef<HTMLDivElement>(null);

  console.log("ChatMessages", { currentComments });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [currentComments]);

  return (
    <Container>
      {currentComments.map((comment) => (
        <ChatMessage key={`comment-${comment.id}`} {...comment} />
      ))}
      <div ref={bottomRef}></div>
    </Container>
  );
};

export default ChatMessages;
