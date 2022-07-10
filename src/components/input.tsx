import styled from "styled-components";

interface Props {
  label: string;
  type: string;
  name: string;
  value: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputWrap = styled.div`
  width: 100%;

  & + & {
    margin-top: 10px;
  }

  & > input {
    width: 60%;
    max-width: 200px;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 14px;
`

const Input: React.FC<Props> = ({ label, error, ...otherProps }) => {
  return (
    <InputWrap>
      <label>{label}：</label>
      <input {...otherProps} />
      <ErrorMessage>{error}</ErrorMessage>
    </InputWrap>
  );
};

export default Input;
