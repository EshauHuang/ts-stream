import { useContext, useState, useEffect, useRef } from "react";

import { UserContext } from "@/contexts/userContext";
import { MessagesContext } from "@/contexts/messagesContext";

import {
  Container,
  TopField,
  Photo,
  InputField,
  DivInput,
  Underline,
  BottomField,
  EmojiPicker,
  SendButton,
} from "./send-message.style";

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
