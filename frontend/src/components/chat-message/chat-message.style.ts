import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  font-size: 14px;
  padding: 4px 24px;
  color: #fff;
`;

export const AuthorPhoto = styled.div`
  width: 24px;
  height: 24px;
  min-width: 24px;
  background-color: #fff;
  border-radius: 50%;
  margin-right: 16px;
`;

export const Content = styled.div`
  display: flex;
  align-items: center;
`;

export const Timestamp = styled.span`
  font-size: 11px;
  margin-right: 8px;
`;

export const AuthorChip = styled.div`
  display: inline-flex;
  align-items: center;
  margin-right: 8px;
`;

export const AuthorName = styled.span`
  color: rgba(255, 255, 255, 0.7);
`;

export const MemberIcon = styled.div`
  width: 16px;
  height: 16px;
  min-width: 16px;
  border-radius: 50%;
  background-color: red;
  margin-left: 2px;
`;

export const Message = styled.span`
  word-wrap: break-word;
  word-break: break-word;
`;