import { Label, LabelWrap } from "@/components/ui/ui.style";
import {
  StyledTextareaField,
  TextareaWrap,
  Textarea,
} from "./textarea-field.style";

interface ITextarea {
  label: string;
  name: string;
  value: string;
  placeholder: string;
  error?: string;
  cols?: number;
  rows?: number;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const TextareaField = ({ label, ...otherProps }: ITextarea) => {
  return (
    <StyledTextareaField>
      <LabelWrap>
        <Label>{label}</Label>
      </LabelWrap>
      <TextareaWrap>
        <Textarea wrap="hard" {...otherProps} />
      </TextareaWrap>
    </StyledTextareaField>
  );
};

export default TextareaField;
