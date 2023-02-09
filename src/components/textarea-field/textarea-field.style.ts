import styled from "styled-components";

import { LabelWrap } from "@/components/ui/ui.style";

export const TextareaWrap = styled.div``;

export const Textarea = styled.textarea`
  width: 100%;
  resize: none;
  background-color: rgba(255, 255, 255, 0.16);
  border-width: 2px;
  border-style: solid;
  border-color: transparent;
  border-radius: 6px;
  color: #c9d1d9;
  padding: 8px;
  transition: border 100ms ease-in, background-color 100ms ease-in;

  &:hover {
    border-color: rgba(255, 255, 255, 0.65);
  }

  &:focus {
    outline: none;
    background-color: black;
    border-color: #ff9800;
  }

  &::placeholder {
    color: #8b949e;
  }
`;

export const StyledTextareaField = styled.div`
  display: flex;

  ${LabelWrap} {
    align-items: stretch;
  }

  ${TextareaWrap} {
    flex-grow: 1;
  }
`;