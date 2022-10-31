import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  padding: 20px;
`;

export const TopField = styled.div`
  display: flex;
`;

export const Photo = styled.div`
  width: 24px;
  height: 24px;
  min-width: 24px;
  background-color: blue;
  border-radius: 50%;
`;

export const InputField = styled.div`
  color: white;
  flex-grow: 1;
  margin-left: 20px;
`;

export const Underline = styled.div`
  width: 100%;
  height: 1px;
  background-color: #666;
  margin-top: 2px;
`;

export const Input = styled.input`
  color: white;
  width: 100%;
`;

export const DivInput = styled.div`
  color: white;
  word-break: break-word;
  max-width: 100%;
  min-height: 18px;
  max-height: 100px;
  overflow-y: auto;
  overflow-x: hidden;
  overflow-wrap: break-word;
  font-size: 1.1625rem;

  &:hover {
    border: 0;
  }

  &:focus-visible {
    outline: 0;
  }
`;

export const BottomField = styled.div`
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
`;

export const EmojiPicker = styled.div``;

export const SendButton = styled.button`
  font-size: 1.1625rem;
  padding: 5px;
  background-color: #fff;
  cursor: pointer;
  color: black;
`;