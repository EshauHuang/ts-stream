import { useContext, useState, useEffect } from "react";
import styled from "styled-components";

import { UserContext } from "@/contexts/userContext";
import { MessagesContext } from "@/contexts/messagesContext";

const Container = styled.div`
  width: 100%;
  padding: 20px;
`;

const TopField = styled.div`
  display: flex;
`;

const Photo = styled.div`
  width: 24px;
  height: 24px;
  background-color: blue;
  border-radius: 50%;
`;

const InputField = styled.div`
  color: white;
  flex-grow: 1;
  margin-left: 20px;
`;

const Underline = styled.div`
  width: 100%;
  height: 1px;
  background-color: #666;
  margin-top: 2px;
`;

const Input = styled.input`
  width: 100%;
`;

const BottomField = styled.div`
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
`;

const EmojiPicker = styled.div``;

const SendButton = styled.button`
  font-size: 14px;
  padding: 5px;
  background-color: #fff;
  cursor: pointer;
  color: black;
`;

const SendMessage = () => {
  const { currentUser } = useContext(UserContext);
  const { sendMessageByUser } = useContext(MessagesContext);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!currentUser) return;
  }, [currentUser]);

  const handleChangeValue: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { value } = e.target;

    setMessage(value);
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (!currentUser || !message) return;
    const { username } = currentUser;

    sendMessageByUser({ username, message });
    setMessage("");
  };

  return (
    <Container as="form" onSubmit={handleSubmit}>
      <TopField>
        <Photo />
        <InputField>
          <div>Eshau</div>
          <Input type="text" value={message} onChange={handleChangeValue} />
          <Underline />
        </InputField>
      </TopField>
      <BottomField>
        <EmojiPicker />
        <SendButton type="submit">送出</SendButton>
      </BottomField>
    </Container>
  );
};

export default SendMessage;
