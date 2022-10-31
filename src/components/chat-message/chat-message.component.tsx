import {
  Container,
  AuthorPhoto,
  Content,
  AuthorChip,
  AuthorName,
  MemberIcon,
  Message,
} from "./chat.message.style";

interface Props {
  name: string;
  message: string;
}

const ChatMessage: React.FC<Props> = ({ name, message }) => {
  return (
    <Container>
      <AuthorPhoto />
      <Content>
        <AuthorChip>
          {/* <Timestamp>2:47 PM</Timestamp> */}
          <AuthorName>{name}</AuthorName>
          <MemberIcon />
        </AuthorChip>
        <Message>{message}</Message>
      </Content>
    </Container>
  );
};

export default ChatMessage;
