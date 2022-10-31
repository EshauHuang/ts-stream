import { useContext, useEffect, useRef } from "react";

import { MessagesContext } from "@/contexts/messagesContext";

import ChatMessage from "@/components/chat-message/chat-message.component";
import { Container} from "./chat-messages.style"



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
