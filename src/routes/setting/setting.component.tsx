import { useState, useEffect, useContext } from "react";
import styled from "styled-components";

import Input from "@/components/input/input.component";

import { UserContext } from "@/contexts/userContext";

import { getStream } from "@/api/stream";

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

const Title = styled.h2`
  font-size: 3rem;
  margin-bottom: 3rem;
  font-weight: bold;
  text-align: center;
`;

const Textarea = styled.textarea`
  width: 100%;
  height: 40%;
  resize: none;
`;

const Label = styled.label`
  font-size: 1.675rem;
`;

interface IStreamMeta {
  title: string;
  content: string;
  streamKey: string;
}

const Setting = () => {
  const { currentUser } = useContext(UserContext);
  const [streamMeta, setStreamMeta] = useState<IStreamMeta>({
    title: "",
    content: "",
    streamKey: "",
  });

  console.log({ streamMeta });

  const handleChangeValue: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e) => {
    const { value, name } = e.target;

    setStreamMeta((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (!currentUser) return;

    const { username } = currentUser;

    const fetchStream = async () => {
      const { stream } = await getStream(username);
      console.log({ stream });

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
      <Input
        label="title"
        type="text"
        name="title"
        value={streamMeta.title}
        onChange={handleChangeValue}
      />
      <Label>detail: </Label>
      <Textarea
        // label="content"
        name="content"
        value={streamMeta.content}
        onChange={handleChangeValue}
      />
      <div>{streamMeta.streamKey}</div>
    </Container>
  );
};

export default Setting;
