import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import _ from "lodash-es";

import PreviewImage from "@/components/preview-image/preview-image.component";
import Input from "@/components/input/input.component";
import { ErrorMessage } from "@/components/input/input.style";
import ContentEditableField from "@/components/content-editable-field/content-editable-field.component";
import StreamKeyField from "@/components/stream-key/stream-key.component";
import {
  Layout,
  LayoutContainer,
  LabelWrap,
  Label,
} from "@/components/ui/ui.style";
import { ButtonField } from "@/components/ui/button.style";
import { Container, Form, Title } from "./setting.style";

import { UserContext } from "@/contexts/userContext";

import {
  getMe,
  editUserMeta,
  refreshStreamKey,
  createOrEditStreamThumbnail,
} from "@/api/stream";

import {
  inputValidate,
  formatInputAndValidateOptions,
} from "@/utils/inputValidate";
import convertFileToImageBlob from "@/utils/convertFileToImageBlob";

import {
  InputFileField,
  ThumbnailPreview,
  AddPhotoWrap,
  AddPhotoButton,
  StyledButton,
} from "./setting.style";


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
    thumbnail: string;
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
    thumbnail: "",
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
  img: "",
};

const validateRulesOptions = {
  title: {
    label: "標題",
    rules: ["required"],
  },
  img: {
    label: "圖片",
    rules: ["imgSize"],
  },
};

const Setting = () => {
  const { username } = useParams();
  const { currentUser } = useContext(UserContext);
  const [settingData, setSettingData] =
    useState<ISettingData>(initialSettingData);
  const [tmpSettingData, setTmpSettingData] = useState(initialSettingData);
  const [error, setError] = useState(initialError);
  const { stream, user } = settingData || {};
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);
  const [imageUrl, setImageUrl] = useState<string>();
  const { thumbnail } = stream || {};

  const isDataChanged = !_.isEqual(settingData, tmpSettingData) || !!imageUrl;

  const showThumbnail =
    imageUrl ||
    (thumbnail && `${import.meta.env.VITE_API_SERVER_URL}${thumbnail}`) ||
    undefined;

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

    let inputValidateOptions;

    if (imageBlob) {
      inputValidateOptions = formatInputAndValidateOptions(
        { title, img: imageBlob },
        validateRulesOptions
      );
    } else {
      inputValidateOptions = formatInputAndValidateOptions(
        { title },
        validateRulesOptions
      );
    }

    const newErrorMessages = inputValidateOptions.reduce((errorObj, option) => {
      const { name } = option;
      return { ...errorObj, [name]: inputValidate(option) };
    }, initialError);

    const isValid = Object.values(newErrorMessages).every((value) => !value);

    if (!isValid) {
      setError(newErrorMessages);
    } else {
      setError(initialError);

      let streamDataEditedSuccess = {};

      if (!isDataChanged) return;
      const { data } = await editUserMeta(username, {
        title,
        content,
      });

      if (data) {
        const { stream } = data;
        streamDataEditedSuccess = Object.assign(
          { ...stream },
          streamDataEditedSuccess
        );
      }

      if (imageBlob) {
        try {
          const formData = new FormData();
          formData.append("thumbnail", imageBlob, "image.jpg");

          const { data } = await createOrEditStreamThumbnail(
            username,
            formData
          );

          if (data) {
            const { stream } = data;

            if (!stream) return;

            streamDataEditedSuccess = Object.assign(
              { ...stream },
              streamDataEditedSuccess
            );
          }
        } catch (error) {
          console.log(error);
        }
      }

      setSettingData((prev) => ({
        ...prev,
        stream: {
          ...prev.stream,
          ...streamDataEditedSuccess,
        },
      }));

      setTmpSettingData(() => ({
        ...settingData,
        stream: {
          ...settingData.stream,
          ...streamDataEditedSuccess,
        },
      }));

      setImageUrl("");
      setImageBlob(null);
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

    const fetchMe = async () => {
      const { data } = await getMe();

      if (data) {
        setSettingData(data);
        setTmpSettingData(data);
      }
    };

    fetchMe();
  }, [currentUser]);

  const handleInputFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];

    if (!file) return;

    convertFileToImageBlob(file, (blob) => {
      setImageBlob(blob);
      const url = URL.createObjectURL(blob);
      setImageUrl(url);
    });
  };

  const handleImageLoaded = () => {
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }
  };

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
            <InputFileField>
              <LabelWrap>
                <Label>Stream Thumbnail</Label>
              </LabelWrap>
              <ThumbnailPreview>
                <AddPhotoWrap>
                  <AddPhotoButton>
                    <PreviewImage
                      handleImageLoaded={handleImageLoaded}
                      showThumbnail={showThumbnail}
                    />
                    <input
                      onChange={(e) => handleInputFile(e)}
                      type="file"
                      style={{
                        display: "none",
                      }}
                    />
                  </AddPhotoButton>
                </AddPhotoWrap>
              </ThumbnailPreview>
              {error.img ? (
                <ErrorMessage>{error.img}</ErrorMessage>
              ) : (
                <div>&nbsp;</div>
              )}
            </InputFileField>
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
            {isDataChanged ? (
              <StyledButton
                type="button"
                fColor="#fff"
                bgColor="transparent"
                onClick={() => {
                  if (isDataChanged) {
                    setSettingData(tmpSettingData);
                    setImageUrl("");
                    setImageBlob(null);
                  }
                }}
              >
                復原變更
              </StyledButton>
            ) : (
              <StyledButton
                type="button"
                fColor="rgba(255,255,255,0.5)"
                bgColor="transparent"
                disabled
              >
                復原變更
              </StyledButton>
            )}
            {isDataChanged ? (
              <StyledButton
                type="submit"
                fColor="#fff"
                bgColor="#f2711c"
                bgHover="#f26202"
              >
                確定
              </StyledButton>
            ) : (
              <StyledButton
                type="submit"
                fColor="rgba(255,255,255,0.5)"
                bgColor="rgba(255,255,255,0.16)"
                disabled
              >
                確定
              </StyledButton>
            )}
          </ButtonField>
        </Layout>
      </Form>
    </Container>
  );
};

export default Setting;
