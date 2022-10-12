import { useContext, useState, useEffect, useRef } from "react";
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
  min-width: 24px;
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
  color: white;
  width: 100%;
`;

const DivInput = styled.div`
  color: white;
  word-break: break-word;
  max-width: 100%;
  min-height: 18px;
  max-height: 100px;
  overflow-y: auto;
  overflow-x: hidden;
  overflow-wrap: break-word;

  &:hover {
    border: 0;
  }

  &:focus-visible {
    outline: 0;
  }
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
  const inputRef = useRef<HTMLInputElement | null>(null);
  const submitBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!currentUser) return;
  }, [currentUser]);

  const handleChangeValue: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { innerText } = e.target;

    setMessage(innerText);
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    console.log("object");
    e.preventDefault();
    const inputEle = inputRef.current;

    if (!currentUser || !message || !inputEle) return;
    const { username } = currentUser;

    sendMessageByUser({ username, message });
    setMessage("");
    inputEle.innerText = "";
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key.toUpperCase() === "ENTER") {
      e.preventDefault();
      if (!e.target.innerText) return;

      submitBtnRef.current?.click();
    }
  };
  const handlePaste: React.ClipboardEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    let text = e.clipboardData.getData("text/plain");
    text = text.replace(/[\r\n]/gm, "");
    console.log(text);
    document.execCommand("insertText", false, text);
  };

  return (
    <Container as="form" onSubmit={handleSubmit}>
      <TopField>
        <Photo />
        <InputField>
          <div>Eshau</div>
          <DivInput
            ref={inputRef}
            onPaste={handlePaste}
            onInput={handleChangeValue}
            onKeyDown={handleKeyDown}
            contentEditable
          ></DivInput>
          <Underline />
        </InputField>
      </TopField>
      <BottomField>
        <EmojiPicker />
        <SendButton type="submit" ref={submitBtnRef}>
          送出
        </SendButton>
      </BottomField>
    </Container>
    // <DivInput onInput={handleChangeValue} contentEditable></DivInput>
  );
};

export default SendMessage;
