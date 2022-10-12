import styled from "styled-components";

import ChatMessages from "@/components/chatMessages";
import SendMessage from "@/components/sendMessage";

const Container = styled.div`
  width: 34rem;
  max-height: 596px;
  border: 1px solid #fff;
  display: flex;
  flex-direction: column;
  background-color: #333;
`;

const ViewModeBar = styled.div`
  width: 100%;
  height: 5%;
  border-bottom: 1px solid #fff;
  font-size: 14px;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
`;

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
