import { TCommentInfo } from "@/contexts/commentsContext";

import {
  Container,
  Avatar,
  Content,
  AuthorChip,
  AuthorName,
  MemberIcon,
  Message,
  Timestamp,
} from "./chat-message.style";

import { StyledAccountCircleIcon } from "@/components/ui/icon.style";

const ChatMessage: React.FC<TCommentInfo> = ({ author, message }) => {

  const avatarUrl = author.username
    ? `${import.meta.env.VITE_API_SERVER_URL}/users/${author.username}/avatar`
    : "";

  return (
    <Container>
      <Avatar>
        {avatarUrl ? <img src={avatarUrl} /> : <StyledAccountCircleIcon />}
      </Avatar>
      <Content>
        <AuthorChip>
          {/* <Timestamp>{message.date}</Timestamp> */}
          <AuthorName>{author.username}</AuthorName>
          {/* <MemberIcon /> */}
        </AuthorChip>
        <Message>{message.text}</Message>
      </Content>
    </Container>
  );
};

export default ChatMessage;
