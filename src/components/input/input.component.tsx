import {
  Container,
  InputWrap,
  ErrorMessage,
  Label,
  LabelWrap,
} from "./input.style";

interface Props {
  labelWidth?: string;
  label: string;
  type: string;
  name: string;
  value: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<Props> = ({
  label,
  labelWidth,
  error,
  ...otherProps
}) => {
  return (
    <Container>
      <InputWrap>
        <LabelWrap labelWidth={labelWidth}>
          <Label>{label}</Label>
        </LabelWrap>
        <input {...otherProps} />
      </InputWrap>
      <ErrorMessage labelWidth={labelWidth}>{error}</ErrorMessage>
    </Container>
  );
};

export default Input;
