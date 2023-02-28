import styled from "styled-components";

import ContentEditable from "@/components/content-editable/content-editable.component";

import { LabelWrap } from "@/components/ui/ui.style";

export const ContentEditableWrap = styled.div``;

export const StyledContentEditable = styled(ContentEditable)`
  width: 100%;
  resize: none;
  background-color: rgba(255, 255, 255, 0.16);
  min-height: 150px;
  border-width: 2px;
  border-style: solid;
  border-color: transparent;
  border-radius: 6px;
  color: #c9d1d9;
  padding: 8px;
  transition: border 100ms ease-in, background-color 100ms ease-in;
  white-space: pre-wrap;

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

export const StyledContentEditableField = styled.div`
  display: flex;

  ${LabelWrap} {
    align-items: stretch;
  }

  ${ContentEditableWrap} {
    flex-grow: 1;
  }
`;