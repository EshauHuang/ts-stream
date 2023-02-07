import { CommentsProps } from "@/contexts/commentsContext"

import {
  Container,
  AuthorPhoto,
  Content,
  AuthorChip,
  AuthorName,
  MemberIcon,
  Message,
  Timestamp,
} from "./chat.message.style";

const ChatMessage: React.FC<CommentsProps> = ({ id, user, message }) => {

  return (
    <Container>
      <AuthorPhoto />
      <Content>
        <AuthorChip>
          <Timestamp>{message.date}</Timestamp>
          <AuthorName>{user.username}</AuthorName>
          <MemberIcon />
        </AuthorChip>
        <Message>{message.text}</Message>
      </Content>
    </Container>
  );
};

export default ChatMessage;
