import ChatMessages from "@/components/chat-messages/chat-messages.component";
import SendMessage from "@/components/send-message/send-message.component";
import { Container, ViewModeBar } from "./chatroom.style";

const Chatroom = () => {
  return (
    <Container>
      <ViewModeBar>ViewModeBar</ViewModeBar>
      <ChatMessages />
      <SendMessage />
    </Container>
  );
};

export default Chatroom;
