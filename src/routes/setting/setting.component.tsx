import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";

import Input from "@/components/input/input.component";

import { UserContext } from "@/contexts/userContext";

import { getStream, editStream } from "@/api/stream";
import {
  inputValidate,
  formatInputAndValidateOptions,
} from "@/utils/inputValidate";

const Container = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  background-color: #333;
  width: 90%;
  max-width: 500px;
  height: 450px;
  transform: translate(-50%, -50%);
  color: white;
  padding: 20px 40px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;

  & > div + div {
    margin-top: 15px;
  }
`;

const Title = styled.h2`
  font-size: 3rem;
  margin-bottom: 3rem;
  font-weight: bold;
  text-align: center;
`;

const Textarea = styled.textarea`
  width: 100%;
  height: 40%;
  resize: vertical;
  background-color: #30363d;
  border: 1px solid #757b81;
  border-radius: 6px;
  color: #c9d1d9;
  padding: 8px;

  &:focus {
    outline: none;
    border-color: #58a6ff;
    box-shadow: inset 0 0 0 1px transparent;
  }

  &::placeholder {
    color: #8b949e;
  }
`;

const ButtonField = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const Button = styled.button`
  border: 1px solid grey;
  background-color: white;
  padding: 4px;
  cursor: pointer;
`;

const Label = styled.label`
  font-size: 1.675rem;
`;

interface IStreamMeta {
  title: string;
  content: string;
  streamKey: string;
}

interface ITextarea {
  name: string;
  value: string;
  placeholder: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const TextareaField = (props: ITextarea) => {
  return (
    <div>
      <Textarea wrap="hard" {...props} />
    </div>
  );
};

interface IStreamKey {
  label: string;
  streamKey: string;
}

const StreamKeyField = ({ label, streamKey }: IStreamKey) => {
  return (
    <div>
      <Label>{label}: </Label>
      <div>{streamKey}</div>
    </div>
  );
};

const initialError = {
  title: "",
};

const validateRulesOptions = {
  title: {
    label: "標題",
    rules: ["required"],
  },
};

const Setting = () => {
  const { currentUser } = useContext(UserContext);
  const [streamMeta, setStreamMeta] = useState<IStreamMeta>({
    title: "",
    content: "",
    streamKey: "",
  });
  const [error, setError] = useState(initialError);
  const { username } = useParams();

  const handleChangeValue: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e) => {
    const { value, name } = e.target;

    setStreamMeta((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!username) return;

    const { title } = streamMeta;

    const inputValidateOptions = formatInputAndValidateOptions(
      { title },
      validateRulesOptions
    );

    const newErrorMessages = inputValidateOptions.reduce((errorObj, option) => {
      const { name } = option;
      return { ...errorObj, [name]: inputValidate(option) };
    }, initialError);

    const isValid = Object.values(newErrorMessages).every((value) => !value);

    console.log(newErrorMessages);

    if (!isValid) {
      setError(newErrorMessages);
    } else {
      setError(initialError);
      console.log("submit");
      const data = await editStream(username, {
        title: streamMeta.title,
        content: streamMeta.content,
      });

      console.log({ data });
    }
  };

  useEffect(() => {
    if (!currentUser) return;

    const { username } = currentUser;

    const fetchStream = async () => {
      const { stream } = await getStream(username);
      const { streamKey, title, content } = stream;

      setStreamMeta({
        streamKey,
        title,
        content,
      });
    };

    fetchStream();
  }, [currentUser]);

  return (
    <Container>
      <Title>Setting</Title>
      <Form onSubmit={handleSubmit}>
        <StreamKeyField label="stream key" streamKey={streamMeta.streamKey} />
        <Input
          label="title"
          type="text"
          name="title"
          value={streamMeta.title}
          error={error.title}
          onChange={handleChangeValue}
        />
        <TextareaField
          name="content"
          placeholder="detail"
          value={streamMeta.content}
          onChange={handleChangeValue}
        />
        <ButtonField>
          <Button type="submit">確定</Button>
        </ButtonField>
      </Form>
    </Container>
  );
};

export default Setting;
