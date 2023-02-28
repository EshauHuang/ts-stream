import { useContext, useState, useEffect, useRef } from "react";
import { Socket } from "socket.io-client";
import { ContentEditableEvent } from "react-contenteditable";

import { UserContext } from "@/contexts/userContext";

import {
  Container,
  TopField,
  Photo,
  InputField,
  StyledContentEditable,
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
  const submitBtnRef = useRef<HTMLButtonElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!currentUser) return;
  }, [currentUser]);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    if (!currentUser || !message) return;
    const { username } = currentUser;

    socket?.emit("send-message", message);

    // sendCommentByUser({ username, message });
    setMessage("");
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

  const handleChangeValue = (e: ContentEditableEvent) => {
    const content = contentRef.current;

    if (!content) return;

    const { value } = e.target;
    const { scrollHeight } = content;

    if (scrollHeight >= 100)
      content.scrollIntoView({ block: "nearest", inline: "nearest" });
    setMessage(value);
  };
  
  return (
    <Container as="form" onSubmit={handleSubmit}>
      <TopField>
        <Photo />
        <InputField>
          <div>Eshau</div>
          <StyledContentEditable
            html={message}
            innerRef={contentRef}
            onPaste={handlePaste}
            onChange={handleChangeValue}
          />
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
