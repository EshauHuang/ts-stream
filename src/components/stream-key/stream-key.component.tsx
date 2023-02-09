import styled from "styled-components";

import { Label, LabelWrap } from "../ui/ui.style";
import { Button, ButtonWrap } from "../ui/button.style";

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

const Content = styled.div`
  flex-grow: 1;
  min-width: 0;
  display: flex;
`;

const StyledStreamKeyField = styled.div`
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

interface IStreamKey {
  label: string;
  streamKey: string;
  handleRefreshStreamKey: () => void;
  handleCopyText: () => void;
}

const StreamKeyField = ({
  label,
  streamKey,
  handleCopyText,
  handleRefreshStreamKey,
}: IStreamKey) => {
  return (
    <StyledStreamKeyField>
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
    </StyledStreamKeyField>
  );
};

export default StreamKeyField;
