import React, { useEffect, useRef } from "react";
import ReactContentEditable, {
  ContentEditableEvent,
} from "react-contenteditable";

import { ReactContentEditableWrap, Label } from "./content-editable.style";

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
