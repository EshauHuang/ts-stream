import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";

import Input from "@/components/input/input.component";
import { Layout, LayoutContainer } from "@/components/ui/ui.style";

import { UserContext } from "@/contexts/userContext";

import { getStream, editStream, refreshStreamKey } from "@/api/stream";

import {
  inputValidate,
  formatInputAndValidateOptions,
} from "@/utils/inputValidate";

const Container = styled.div`
  padding: 4rem 4rem 0;
  color: white;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  background-color: #18181b;
  padding: 2rem 2rem 0;
  border-radius: 0.4rem;
`;

const Title = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  font-weight: bold;
`;

const TextareaWrap = styled.div``;

const Textarea = styled.textarea`
  width: 100%;
  resize: none;
  background-color: rgba(255, 255, 255, 0.16);
  border-width: 2px;
  border-style: solid;
  border-color: transparent;
  border-radius: 6px;
  color: #c9d1d9;
  padding: 8px;
  transition: border 100ms ease-in, background-color 100ms ease-in;

  &:hover {
    border-color: rgba(255, 255, 255, 0.65);
  }

  &:focus {
    outline: none;
    background-color: black;
    border-color: #ff9800;
  }

  &::placeholder {
    color: #8b949e;
  }
`;

const ButtonField = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const Button = styled.button<{
  bgColor?: string;
  fColor?: string;
  bgHover?: string;
}>`
  height: 3rem;
  padding-left: 1rem;
  padding-right: 1rem;
  flex-shrink: 0;
  border: 0;
  border-radius: 0.4rem;
  background-color: white;
  cursor: pointer;
  background-color: ${({ bgColor }) =>
    bgColor ? bgColor : "rgba(255, 255, 255, 0.2)"};
  color: ${({ fColor }) => (fColor ? fColor : "black")};

  &:hover {
    background-color: ${({ bgHover }) => bgHover};
  }
`;

const Label = styled.label`
  font-size: 1.4rem;
  font-weight: bold;
`;

interface IStreamMeta {
  title: string;
  content: string;
  streamKey: string;
}

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

interface IStreamKey {
  label: string;
  streamKey: string;
  handleRefreshStreamKey: () => void;
  handleCopyText: () => void;
}

const LabelWrap = styled.div`
  width: 15rem;
  flex-shrink: 0;
  display: flex;
  align-items: center;
`;

const Content = styled.div`
  flex-grow: 1;
  min-width: 0;
  display: flex;
`;

const StreamKeyTextWrap = styled.div`
  flex-grow: 1;
  display: flex;
  padding-right: 0.5rem;
`;

const StreamKeyText = styled.input`
  background-color: rgba(255, 255, 255, 0.16);
  font-size: 1.4rem;
  overflow: hidden;
  width: 100%;
  border-radius: 0.4rem;
  border-style: solid;
  border-width: 2px;
  border-color: rgba(255, 255, 255, 0.16);
  padding: 0.5rem 1rem;
  color: white;
  background-clip: padding-box;
  transition: border 100ms ease-in, background-color 100ms ease-in;

  &:hover {
    border-color: rgba(255, 255, 255, 0.65);
  }

  &:focus {
    background-color: black;
    border-color: #ff9800;
  }
`;

const ButtonWrap = styled.div`
  padding-left: 0.8rem;
  flex-shrink: 0;
`;

const StyledStreamField = styled.div`
  position: relative;
  display: flex;

  ${Label} {
    font-size: 1.3rem;
    font-weight: bold;
  }

  ${Button} {
    height: 3rem;
    padding-left: 1rem;
    padding-right: 1rem;
    flex-shrink: 0;
    border: 0;
  }
`;

const StyledTextareaField = styled.div`
  display: flex;

  ${LabelWrap} {
    align-items: stretch;
  }

  ${TextareaWrap} {
    flex-grow: 1;
  }
`;

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

const StreamKeyField = ({
  label,
  streamKey,
  handleCopyText,
  handleRefreshStreamKey,
}: IStreamKey) => {
  return (
    <StyledStreamField>
      <LabelWrap>
        <Label>{label}</Label>
      </LabelWrap>
      <Content>
        <StreamKeyTextWrap>
          <StreamKeyText value={streamKey} type="password" readOnly />
        </StreamKeyTextWrap>
        <Button
          fColor="#fff"
          bgColor="#f2711c"
          bgHover="#f26202"
          type="button"
          onClick={handleCopyText}
        >
          複製
        </Button>
        <ButtonWrap>
          <Button fColor="#fff" type="button" onClick={handleRefreshStreamKey}>
            刷新
          </Button>
        </ButtonWrap>
      </Content>
    </StyledStreamField>
  );
};

const initialStreamMeta = {
  title: "",
  content: "",
  streamKey: "",
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
  const [streamMeta, setStreamMeta] = useState<IStreamMeta>(initialStreamMeta);
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

    if (!isValid) {
      setError(newErrorMessages);
    } else {
      setError(initialError);
      const data = await editStream(username, {
        title: streamMeta.title,
        content: streamMeta.content,
      });

      console.log({ data });
    }
  };

  const handleRefreshStreamKey = async () => {
    if (!username) return;

    const { streamKey } = await refreshStreamKey(username);
    setStreamMeta((prev) => ({
      ...prev,
      streamKey,
    }));
  };

  const handleCopyText = () => {
    const { streamKey } = streamMeta;
    navigator.clipboard.writeText(streamKey);
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
        <LayoutContainer>
          <Layout>
            <StreamKeyField
              label="Primary Stream key"
              streamKey={streamMeta.streamKey}
              handleRefreshStreamKey={handleRefreshStreamKey}
              handleCopyText={handleCopyText}
            />
          </Layout>
          <Layout>
            <Input
              label="Stream Title"
              type="text"
              name="title"
              value={streamMeta.title}
              error={error.title}
              onChange={handleChangeValue}
            />
          </Layout>
          <Layout>
            <TextareaField
              label="Stream Information"
              rows={5}
              name="content"
              placeholder="about your stream..."
              value={streamMeta.content}
              onChange={handleChangeValue}
            />
          </Layout>
        </LayoutContainer>
        <Layout>
          <ButtonField>
            <Button
              type="submit"
              fColor="#fff"
              bgColor="#f2711c"
              bgHover="#f26202"
            >
              確定
            </Button>
          </ButtonField>
        </Layout>
      </Form>
    </Container>
  );
};

export default Setting;
