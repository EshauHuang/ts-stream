import { Container, InputWrap, ErrorMessage} from "./input.style"

interface Props {
  label: string;
  type: string;
  name: string;
  value: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<Props> = ({ label, error, ...otherProps }) => {
  return (
    <Container>
      <InputWrap>
        <label>{label}：</label>
        <input {...otherProps} />
      </InputWrap>
      <ErrorMessage>{error}</ErrorMessage>
    </Container>
  );
};

export default Input;
