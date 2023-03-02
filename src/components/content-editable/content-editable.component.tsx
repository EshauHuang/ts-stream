import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import ReactContentEditable, {
  ContentEditableEvent,
} from "react-contenteditable";

const Label = styled.label`
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

const ReactContentEditableWrap = styled.div<{ padding?: string }>`
  position: relative;
  z-index: 1;

  ${Label} {
    top: ${({ padding }) => (padding ? `${padding}px` : "0px")};
    left: ${({ padding }) => (padding ? `${padding}px` : "0px")};
  }
`;

interface ContentEditableProps {
  onPaste?: (event: React.ClipboardEvent<HTMLDivElement>) => void;
  onChange?: (event: ContentEditableEvent) => void;
  onBlur?: (event: React.FormEvent<HTMLDivElement>) => void;
  onInput?: (event: React.FormEvent<HTMLDivElement>) => void;
  onKeyPress?: (event: React.KeyboardEvent<HTMLDivElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLDivElement>) => void;
  html: string;
  padding?: string;
  className?: string;
  innerRef?: React.RefObject<HTMLDivElement>;
  placeholder?: string;
  placeHolderRef?: React.RefObject<HTMLLabelElement>;
}

export const ContentEditable: React.FC<ContentEditableProps> = ({
  onChange,
  onInput,
  onBlur,
  onKeyPress,
  onKeyDown,
  padding,
  placeholder,
  placeHolderRef,
  ...props
}) => {
  const onChangeRef = useRef(onChange);
  const onInputRef = useRef(onInput);
  const onBlurRef = useRef(onBlur);
  const onKeyPressRef = useRef(onKeyPress);
  const onKeyDownRef = useRef(onKeyDown);

  const hasText = !!props.html;

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);
  useEffect(() => {
    onInputRef.current = onInput;
  }, [onInput]);
  useEffect(() => {
    onBlurRef.current = onBlur;
  }, [onBlur]);
  useEffect(() => {
    onKeyPressRef.current = onKeyPress;
  }, [onKeyPress]);
  useEffect(() => {
    onKeyDownRef.current = onKeyDown;
  }, [onKeyDown]);

  return (
    <ReactContentEditableWrap padding={padding}>
      <Label className={`${hasText ? "has-text" : ""}`} ref={placeHolderRef}>
        {placeholder}
      </Label>
      <ReactContentEditable
        {...props}
        onChange={
          onChange
            ? (...args) => {
                if (onChangeRef.current) {
                  onChangeRef.current(...args);
                }
              }
            : () => {}
        }
        onInput={
          onInput
            ? (...args) => {
                if (onInputRef.current) {
                  onInputRef.current(...args);
                }
              }
            : undefined
        }
        onBlur={
          onBlur
            ? (...args) => {
                if (onBlurRef.current) {
                  onBlurRef.current(...args);
                }
              }
            : undefined
        }
        onKeyPress={
          onKeyPress
            ? (...args) => {
                if (onKeyPressRef.current) {
                  onKeyPressRef.current(...args);
                }
              }
            : undefined
        }
        onKeyDown={
          onKeyDown
            ? (...args) => {
                if (onKeyDownRef.current) {
                  onKeyDownRef.current(...args);
                }
              }
            : undefined
        }
      />
    </ReactContentEditableWrap>
  );
};

export default ContentEditable;
