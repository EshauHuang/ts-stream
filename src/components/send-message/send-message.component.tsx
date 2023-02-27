import { useContext, useState, useEffect, useRef } from "react";
import { Socket } from "socket.io-client";

import { UserContext } from "@/contexts/userContext";

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

interface ISendMessage {
  socket: Socket | null;
}

const SendMessage: React.FC<ISendMessage> = ({ socket }) => {
  const { currentUser } = useContext(UserContext);
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const submitBtnRef = useRef<HTMLButtonElement | null>(null);
  const [content, setContent] = useState("");

  useEffect(() => {
    if (!currentUser) return;
  }, [currentUser]);

  useEffect(() => {
    if (!inputRef.current) return;
  }, [inputRef]);

  const handleChangeValue: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { innerText, scrollHeight } = e.target;
    if (scrollHeight >= 100)
      e.target.scrollIntoView({ block: "nearest", inline: "nearest" });
    console.log("handleChangeValue");
    // setMessage(innerText);
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const inputEle = inputRef.current;

    if (!currentUser || !message || !inputEle) return;
    const { username } = currentUser;

    socket?.emit("send-message", message);

    // sendCommentByUser({ username, message });
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
            suppressContentEditableWarning={true}
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
  );
};

export default SendMessage;
