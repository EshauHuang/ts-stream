import styled, {css} from "styled-components";

import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

export const Container = styled.div`
  margin-top: 60px;
  width: calc(100% - 1rem);
  margin-inline: auto;
  display: flex;
  gap: 20px;
  
  @media (max-width: 1024px) {
    flex-direction: column;
  }
`;

export const IconStyle = css`
  padding: 8px 0;
  width: 40px;
  height: 40px;
  color: #fff;
`;

export const MoreHorizIconButton = styled(MoreHorizIcon)`
  ${IconStyle}
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 50%;

  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

export const Primary = styled.div`
  flex-grow: 1;
  color: white;
`;

export const Secondary = styled.div``;

export const Title = styled.h1`
  font-size: 2rem;
  color: #fff;
`;

export const Meta = styled.div`
  padding: 1rem;
`;

export const ActionRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const ChannelMeta = styled.div`
  display: flex;
  align-items: center;
`;

export const UserLink = styled.a`
  padding-right: 0.8rem;
`;

export const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const UserMeta = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  padding: 4px 0;
  margin-right: 2.4rem;
`;

export const Author = styled.div`
  color: white;
  font-size: 1.6rem;
`;

export const Subscribe = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.2rem;
`;

export const SubscribeButton = styled.button`
  background-color: rgba(255, 255, 255, 1);
  color: black;
  padding: 0 1.6rem;
  height: 3.6rem;
  line-height: 3.6rem;
  border-radius: 1.8rem;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background-color: rgba(255, 255, 255, 0.8);
  }
`;

export const FeedbackMeta = styled.div`
  display: flex;
  align-items: center;
`;