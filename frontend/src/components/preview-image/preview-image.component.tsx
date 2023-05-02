import {
  StyledPreviewImage,
  AddPhotoAlternateWrap,
  AddPhotoAlternateButton,
} from "./preview-image.style";

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
