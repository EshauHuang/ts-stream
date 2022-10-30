import styled from "styled-components";

interface Props {
  label: string;
  type: string;
  name: string;
  value: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Container = styled.div`
  & + & {
    margin-top: 10px;
  }
`;

const InputWrap = styled.div`
  width: 100%;

  & > input {
    border: 1px solid #bbb;
    border-radius: 4px;
    padding: 5px;
    color: white;

    &:focus {
      border: 1px solid #005fff;
    }
  }

  label,
  input {
    font-size: 1.675rem;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 1.675rem;
  line-height: 1.675rem;
  height: 1.675rem;
`;

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
