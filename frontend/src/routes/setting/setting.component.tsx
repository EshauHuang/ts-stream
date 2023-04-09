import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import _ from "lodash-es";

import Input from "@/components/input/input.component";
import TextareaField from "@/components/textarea-field/textarea-field.component";
import ContentEditableField from "@/components/content-editable-field/content-editable-field.component";
import StreamKeyField from "@/components/stream-key/stream-key.component";
import { Layout, LayoutContainer } from "@/components/ui/ui.style";
import { Button, ButtonField } from "@/components/ui/button.style";
import { Container, Form, Title } from "./setting.style";

import { UserContext } from "@/contexts/userContext";

import { getUser, editUserMeta, refreshStreamKey } from "@/api/stream";

import {
  inputValidate,
  formatInputAndValidateOptions,
} from "@/utils/inputValidate";

interface ISettingData {
  user: {
    avatar: string;
    email: string;
    id: string;
    streamKey: string;
    subscribes: string;
    username: string;
  };
  stream: {
    author: string;
    content: string;
    dislike: string;
    isStreamOn: boolean;
    like: string;
    startTime: string;
    title: string;
    type: string;
    videoId: string;
  };
}

const initialSettingData = {
  user: {
    avatar: "",
    email: "",
    id: "",
    streamKey: "",
    subscribes: "",
    username: "",
  },
  stream: {
    author: "",
    content: "",
    dislike: "",
    isStreamOn: false,
    like: "",
    startTime: "",
    title: "",
    type: "",
    videoId: "",
  },
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
  const [settingData, setSettingData] =
    useState<ISettingData>(initialSettingData);
  const [error, setError] = useState(initialError);
  const { username } = useParams();
  const { stream, user } = settingData;

  const handleChangeValue: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e) => {
    const { value, name } = e.target;

    setSettingData((prev) => {
      const tmpData = _.cloneDeep(prev);

      const newSettingData = Object.entries(prev).reduce(
        (obj, [dataKey, dataValue]) => {
          if (dataValue.hasOwnProperty(name))
            return {
              ...obj,
              [dataKey]: {
                ...dataValue,
                [name]: value,
              },
            };
          return obj;
        },
        tmpData
      );

      return newSettingData;
    });
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!username) return;
    const { title, content } = stream;
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
      const data = await editUserMeta(username, {
        title,
        content,
      });
    }
  };

  const handleRefreshStreamKey = async () => {
    if (!username) return;

    const { streamKey } = await refreshStreamKey(username);

    setSettingData((prev) => ({
      ...prev,
      user: {
        ...prev.user,
        streamKey,
      },
    }));
    alert("更新成功");
  };

  const handleCopyText = async () => {
    const { streamKey } = user;
    await navigator.clipboard.writeText(streamKey);

    alert("複製成功");
  };

  useEffect(() => {
    if (!currentUser) return;

    const { username } = currentUser;

    const fetchStream = async () => {
      const { data } = await getUser(username);

      setSettingData(data);
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
              streamKey={user.streamKey}
              handleRefreshStreamKey={handleRefreshStreamKey}
              handleCopyText={handleCopyText}
            />
          </Layout>
          <Layout>
            <Input
              label="Stream Title"
              type="text"
              name="title"
              value={stream.title}
              error={error.title}
              onChange={handleChangeValue}
            />
          </Layout>
          <Layout>
            <ContentEditableField
              setValue={(content: string) => {
                setSettingData((prev) => ({
                  ...prev,
                  stream: {
                    ...prev.stream,
                    content,
                  },
                }));
              }}
              label="Stream Information"
              name="content"
              placeholder="About your stream..."
              padding="8"
              value={stream.content}
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
