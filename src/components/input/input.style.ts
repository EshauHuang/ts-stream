import styled from "styled-components";

export const Container = styled.div`
  position: relative;

  & + & {
    margin-top: 10px;
  }
`;

export const LabelWrap = styled.div<{ labelWidth?: string}>`
  display: flex;
  align-items: center;
  width: ${({ labelWidth }) => labelWidth ? `${labelWidth}rem` : "15rem"};
  font-weight: bold;
`

export const Label = styled.label`
  font-size: 1.3rem;
`

export const InputWrap = styled.div`
  width: 100%;
  display: flex;

  & > input {
    background-color: rgba(255, 255, 255, 0.16);
    font-size: 1.4rem;
    overflow: hidden;
    border-radius: 0.4rem;
    border-style: solid;
    border-width: 2px;
    border-color: rgba(255, 255, 255, 0.16);
    padding: 0.5rem 1rem;
    color: white;
    background-clip: padding-box;
    transition: border 100ms ease-in, background-color 100ms ease-in;
    flex-grow: 1;

    &:hover {
      border-color: rgba(255, 255, 255, 0.65);
    }

    &:focus {
      background-color: black;
      border-color: #ff9800;
    }
  }
`;

export const ErrorMessage = styled.div < { labelWidth?: string }>`
  position: absolute;
  top: 100%;
  left: ${({ labelWidth }) => labelWidth ? `${labelWidth}rem` : "15rem"};
  color: red;
  font-size: 1.275rem;
  line-height: 1.675rem;
  height: 1.675rem;
  margin-top: 0.125rem;
`;