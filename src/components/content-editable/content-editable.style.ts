import styled from "styled-components"

export const Label = styled.label`
  position: absolute;
  top: 0;
  left: 0;
  font-size: 1.2rem;
  line-height: 1.8rem;
  max-height: 10rem;
  color: rgba(255, 255, 255, 0.5);
  z-index: -1;

  &.has-text {
    display: none;
  }
`;

export const ReactContentEditableWrap = styled.div<{ padding?: string }>`
  position: relative;
  z-index: 1;

  ${Label} {
    top: ${({ padding }) => (padding ? `${padding}px` : "0px")};
    left: ${({ padding }) => (padding ? `${padding}px` : "0px")};
  }
`;