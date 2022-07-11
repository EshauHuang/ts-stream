import styled from "styled-components";

interface Props {
  name: string;
  message: string;
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  font-size: 14px;
  padding: 4px 24px;
  color: #fff;
`;

const AuthorPhoto = styled.div`
  width: 24px;
  height: 24px;
  background-color: #fff;
  border-radius: 50%;
  margin-right: 16px;
`;

const Body = styled.div`
  display: flex;
  align-items: center;
`;

const Timestamp = styled.span`
  font-size: 11px;
  margin-right: 8px;
`;

const AuthorChip = styled.div`
  display: inline-flex;
  align-items: center;
  margin-right: 8px;
`;

const AuthorName = styled.span``;

const MemberIcon = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: red;
  margin-left: 2px;
`;

const Message = styled.div``;

const ChatMessage: React.FC<Props> = ({ name, message }) => {
  return (
    <Container>
      <AuthorPhoto />
      <Body>
        <AuthorChip>
          <Timestamp>2:47 PM</Timestamp>
          <AuthorName>{name}</AuthorName>
          <MemberIcon />
        </AuthorChip>
        <Message>{message}</Message>
      </Body>
    </Container>
  );
};

export default ChatMessage;
