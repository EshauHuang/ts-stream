import styled from "styled-components"

export const ButtonField = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const ButtonWrap = styled.div`
  padding-left: 0.8rem;
  flex-shrink: 0;
`;

export const Button = styled.button<{
  bgColor?: string;
  fColor?: string;
  bgHover?: string;
}>`
  height: 3rem;
  padding-left: 1rem;
  padding-right: 1rem;
  flex-shrink: 0;
  border: 0;
  border-radius: 0.4rem;
  background-color: white;
  cursor: pointer;
  background-color: ${({ bgColor }) =>
    bgColor ? bgColor : "rgba(255, 255, 255, 0.2)"};
  color: ${({ fColor }) => (fColor ? fColor : "black")};

  &:hover {
    background-color: ${({ bgHover }) => bgHover};
  }
`;