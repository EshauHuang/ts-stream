import { useRef } from "react";
import { ContentEditableEvent } from "react-contenteditable";

import { Label, LabelWrap } from "@/components/ui/ui.style";

import {
  StyledContentEditableField,
  ContentEditableWrap,
  StyledContentEditable,
} from "./content-editable-field.style";

interface IContentEditable {
  label: string;
  name: string;
  value: string;
  placeholder?: string;
  error?: string;
  padding?: string;
  setValue: (content: string) => void;
}

const ContentEditableField = ({
  label,
  value,
  setValue,
  ...otherProps
}: IContentEditable) => {
  const contentRef = useRef<HTMLDivElement | null>(null);

  const handlePaste: React.ClipboardEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    const clipboardData = e.clipboardData;
    const text = clipboardData.getData("text/plain");
    const selection = window.getSelection();
    if (!selection) return;

    const range = selection.getRangeAt(0);

    // Insert the modified text into the contenteditable div
    range.deleteContents();
    range.insertNode(document.createTextNode(text));
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
  };

  const handleChangeValue = (e: ContentEditableEvent) => {
    const content = contentRef.current;

    if (!content) return;

    const { value } = e.target;
    const { scrollHeight } = content;

    if (scrollHeight >= 100)
      content.scrollIntoView({ block: "nearest", inline: "nearest" });
    setValue(value);
  };

  return (
    <StyledContentEditableField>
      <LabelWrap>
        <Label>{label}</Label>
      </LabelWrap>
      <ContentEditableWrap>
        <StyledContentEditable
          html={value}
          innerRef={contentRef}
          onPaste={handlePaste}
          onChange={handleChangeValue}
          {...otherProps}
        />
      </ContentEditableWrap>
    </StyledContentEditableField>
  );
};

export default ContentEditableField;
