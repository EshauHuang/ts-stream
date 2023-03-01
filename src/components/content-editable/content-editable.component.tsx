import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import ReactContentEditable, {
  ContentEditableEvent,
} from "react-contenteditable";

const ReactContentEditableWrap = styled.div`
  position: relative;
  z-index: 1;
`;

const Label = styled.label`
  position: absolute;
  bottom: 0;
  left: 0;
  font-size: 1.2rem;
  line-height: 1.8rem;
  max-height: 10rem;
  color: rgba(255, 255, 255, 0.5);
  z-index: -1;
`;

interface ContentEditableProps {
  onPaste?: (event: React.ClipboardEvent<HTMLDivElement>) => void;
  onChange?: (event: ContentEditableEvent) => void;
  onBlur?: (event: React.FormEvent<HTMLDivElement>) => void;
  onInput?: (event: React.FormEvent<HTMLDivElement>) => void;
  onKeyPress?: (event: React.KeyboardEvent<HTMLDivElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLDivElement>) => void;
  html: string;
  className?: string;
  innerRef?: React.RefObject<HTMLDivElement>;
}

export const ContentEditable: React.FC<ContentEditableProps> = ({
  onChange,
  onInput,
  onBlur,
  onKeyPress,
  onKeyDown,
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
    <ReactContentEditableWrap>
      {!hasText && (
        <Label>以 Eshau 的身分發表公開留言...(已啟用慢速模式)</Label>
      )}

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
