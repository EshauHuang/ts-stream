import { useContext, useState, useEffect, useRef } from "react";
import { Socket } from "socket.io-client";
import { ContentEditableEvent } from "react-contenteditable";

import { Button, ButtonField } from "@/components/ui/button.style";

import { UserContext } from "@/contexts/userContext";

import {
  Container,
  Username,
  TopField,
  Photo,
  InputField,
  StyledContentEditable,
  Underline,
  BottomField,
  EmojiPicker,
} from "./send-message.style";

interface ISendMessage {
  socket: Socket | null;
}

const SendMessage: React.FC<ISendMessage> = ({ socket }) => {
  const { currentUser } = useContext(UserContext);
  const [message, setMessage] = useState("");
  const sendBtnRef = useRef<HTMLButtonElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const placeHolderRef = useRef<HTMLLabelElement | null>(null);

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

      sendBtnRef.current?.click();
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

    if (text && placeHolderRef.current) {
      placeHolderRef.current.classList.add("has-text");
    }
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
          <Username>Eshau</Username>
          <StyledContentEditable
            innerRef={contentRef}
            html={message}
            onPaste={handlePaste}
            onChange={handleChangeValue}
            placeHolderRef={placeHolderRef}
            placeholder="以 Eshau 的身分發表公開留言...(已啟用慢速模式)"
            onKeyDown={(event) => {
              const submitBtn = sendBtnRef.current;

              if (event.keyCode === 13) {
                event.preventDefault();
                submitBtn?.click();
              }
            }}
          />
          <Underline />
        </InputField>
      </TopField>
      <BottomField>
        <EmojiPicker />
        <ButtonField>
          <Button
            ref={sendBtnRef}
            type="submit"
            fColor="#fff"
            bgColor="#f2711c"
            bgHover="#f26202"
          >
            送出
          </Button>
        </ButtonField>
      </BottomField>
    </Container>
  );
};

export default SendMessage;
