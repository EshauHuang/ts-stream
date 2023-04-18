import styled from "styled-components";

import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

const StyledPreviewImage = styled.img`
  width: 100%;
  height: 100%;
`;

const AddPhotoAlternateWrap = styled.div`
  border: 1px dashed white;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const AddPhotoAlternateButton = styled(AddPhotoAlternateIcon)`
  width: 2.4rem;
  height: 2.4rem;
`;

const PreviewImage = ({
  showThumbnail,
  handleImageLoaded,
}: {
  showThumbnail?: string;
  handleImageLoaded: () => void;
}) => {
  return (
    <>
      {showThumbnail ? (
        <StyledPreviewImage onLoad={handleImageLoaded} src={showThumbnail} />
      ) : (
        <AddPhotoAlternateWrap>
          <AddPhotoAlternateButton />
        </AddPhotoAlternateWrap>
      )}
    </>
  );
};

export default PreviewImage;
