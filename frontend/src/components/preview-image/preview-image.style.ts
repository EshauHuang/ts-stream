import styled from "styled-components";

import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

export const StyledPreviewImage = styled.img`
  width: 100%;
  height: 100%;
`;

export const AddPhotoAlternateWrap = styled.div`
  border: 1px dashed white;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const AddPhotoAlternateButton = styled(AddPhotoAlternateIcon)`
  width: 2.4rem;
  height: 2.4rem;
`;