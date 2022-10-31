import styled from "styled-components";

export const Container = styled.div`
  & + & {
    margin-top: 10px;
  }
`;

export const InputWrap = styled.div`
  width: 100%;

  & > input {
    border: 1px solid #bbb;
    border-radius: 4px;
    padding: 5px;
    color: white;

    &:focus {
      border: 1px solid #005fff;
    }
  }

  label,
  input {
    font-size: 1.675rem;
  }
`;

export const ErrorMessage = styled.div`
  color: red;
  font-size: 1.675rem;
  line-height: 1.675rem;
  height: 1.675rem;
`;