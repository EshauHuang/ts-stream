import styled from "styled-components"

import { Label, LabelWrap } from "../ui/ui.style";
import { Button } from "../ui/button.style";

export const StreamKeyTextWrap = styled.div`
  flex-grow: 1;
  display: flex;
  padding-right: 0.5rem;
`;

export const StreamKeyText = styled.input`
  background-color: rgba(255, 255, 255, 0.16);
  font-size: 1.4rem;
  overflow: hidden;
  width: 100%;
  border-radius: 0.4rem;
  border-style: solid;
  border-width: 2px;
  border-color: rgba(255, 255, 255, 0.16);
  padding: 0.5rem 1rem;
  color: white;
  background-clip: padding-box;
  transition: border 100ms ease-in, background-color 100ms ease-in;

  &:hover {
    border-color: rgba(255, 255, 255, 0.65);
  }

  &:focus {
    background-color: black;
    border-color: #ff9800;
  }
`;

export const Content = styled.div`
  flex-grow: 1;
  min-width: 0;
`;

export const TopField = styled.div`
  width: 100%;
  display: flex;
`;

export const BottomField = styled.div`
  display: inline-block;
`;

export const StyledStreamKeyField = styled.div`
  position: relative;
  display: flex;

  ${LabelWrap} {
    align-items: stretch;
  }

  ${Label} {
    font-size: 1.3rem;
    font-weight: bold;
  }

  ${Button} {
    height: 3rem;
    padding-left: 1rem;
    padding-right: 1rem;
    flex-shrink: 0;
    border: 0;
  }
`;

export const StreamKeyShowTypeText = styled.div`
  padding-top: 0.8rem;
  color: #f2711c;
  cursor: pointer;

  &:hover {
    color: #f26202;
    text-decoration: underline;
    text-decoration-color: #f26202;
  }
`;