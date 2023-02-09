import styled from "styled-components"

export const Layout = styled.div<{ lines?: "none" }>`
  padding: 2rem;

  &:not(:last-child) {
    border-bottom: ${({ lines }) => lines === "none" ? 0 : "1px solid rgba(255, 255, 255, 0.2)"};
  }
`;

export const LayoutBottom = styled.div<{ lines?: "none" }>`
  padding: 0 0 2.5rem;

  &:not(:last-child) {
    border-bottom: ${({ lines }) => lines === "none" ? 0 : "1px solid rgba(255, 255, 255, 0.2)"};
  }
`;

export const LayoutContainer = styled.div`
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.4rem;
`;


export const Label = styled.label`
  font-size: 1.4rem;
  font-weight: bold;
`;


export const LabelWrap = styled.div`
  width: 15rem;
  flex-shrink: 0;
  display: flex;
  align-items: center;
`;