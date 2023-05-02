import styled from "styled-components";

import { Button } from "@/components/ui/button.style";

export const Container = styled.div`
  padding: 4rem 4rem 0;
  color: white;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  background-color: #18181b;
  padding: 2rem 2rem 0;
  border-radius: 0.4rem;
`;

export const Title = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  font-weight: bold;
`;


export const InputFileField = styled.div`
  display: flex;
  align-items: center;
  position: relative;

  & > :first-child {
    width: 15rem;
    flex-shrink: 0;
  }

  & > :last-child {
    img {
      object-fit: cover;
      width: 100%;
    }
  }
`;

export const AddPhotoWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const AddPhotoButton = styled.label`
  width: 100%;
  height: 100%;
  width: 50%;
  aspect-ratio: 1280/720;
  max-width: 200px;
  cursor: pointer;

  &:hover {
    background-color: black;
  }
`;

export const ThumbnailPreview = styled.div`
  flex-grow: 1;
`;

export const StyledButton = styled(Button)`
  & + & {
    margin-left: 1.2rem;
  }
`;
