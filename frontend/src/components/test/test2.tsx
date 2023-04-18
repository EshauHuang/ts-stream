import { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import _ from "lodash-es";

import drawPicture from "@/utils/drawPicture";
import convertFileToImageBlob from "@/utils/convertFileToImageBlob";

const Container = styled.form`
  color: white;
  width: 100%;
`;

const Button = styled.button`
  color: white;
  padding: 10px 20px;
  background-color: rgba(255, 255, 255, 0.1);
  cursor: pointer;
`;

const SubmitButton = styled.button`
  color: white;
  padding: 10px 20px;
  background-color: rgba(255, 255, 255, 0.1);
  cursor: pointer;
`;

const PreviewImageWrap = styled.div`
  width: 100%;
  /* aspect-ratio: 1270 / 780; */

  img {
    width: 100%;
  }
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Test = () => {
  const [imageBlob, setImageBlob] = useState<Blob>();
  const [imageUrl, setImageUrl] = useState<string>();

  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];

    if (!file) return;

    convertFileToImageBlob(file, (blob) => {
      setImageBlob(blob);
      const url = URL.createObjectURL(blob);
      setImageUrl(url);
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (!imageBlob) return;

      const formData = new FormData();
      formData.append("thumbnail", imageBlob, "image.jpg");

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container onSubmit={(e) => handleSubmit(e)}>
      <input type="file" onChange={(e) => handleUploadImage(e)} />

      <SubmitButton type="submit">SUBMIT</SubmitButton>

      <PreviewImageWrap className="preview-img">
        {imageUrl && (
          <img
            onLoad={() => {
              URL.revokeObjectURL(imageUrl);
            }}
            src={imageUrl}
          />
        )}
      </PreviewImageWrap>
    </Container>
  );
};

export default Test;
