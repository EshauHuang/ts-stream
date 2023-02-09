import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";

import Input from "@/components/input/input.component";
import TextareaField from "@/components/textarea-field/textarea-field.component";
import StreamKeyField from "@/components/stream-key/stream-key.component";
import { Layout, LayoutContainer } from "@/components/ui/ui.style";
import { Button, ButtonField } from "@/components/ui/button.style";
import { Container, Form, Title } from "./setting.style";

import { UserContext } from "@/contexts/userContext";

import { getStream, editStream, refreshStreamKey } from "@/api/stream";

import {
  inputValidate,
  formatInputAndValidateOptions,
} from "@/utils/inputValidate";

interface IStreamMeta {
  title: string;
  content: string;
  streamKey: string;
}

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
