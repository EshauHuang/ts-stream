import { useState } from "react";

import { Label, LabelWrap } from "../ui/ui.style";
import { Button, ButtonWrap } from "../ui/button.style";

import {
  StyledStreamKeyField,
  Content,
  TopField,
  StreamKeyTextWrap,
  StreamKeyText,
  BottomField,
  StreamKeyShowTypeText,
} from "./stream-key.style";

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
  const [streamKeyShow, setStreamKeyShow] = useState(false);

  const handleStreamKeyShowType = () => {
    if (
      !streamKeyShow &&
      confirm(
        `Never share your stream key with anyone!

Please click "OK" if you understand the above and would like to view your stream key.`
      )
    ) {
      setStreamKeyShow(true);
    } else {
      setStreamKeyShow(false);
    }
  };

  return (
    <StyledStreamKeyField>
      <LabelWrap>
        <Label>{label}</Label>
      </LabelWrap>
      <Content>
        <TopField>
          <StreamKeyTextWrap>
            <StreamKeyText
              value={streamKey}
              type={streamKeyShow ? "text" : "password"}
              readOnly
            />
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
            <Button
              fColor="#fff"
              type="button"
              onClick={handleRefreshStreamKey}
            >
              刷新
            </Button>
          </ButtonWrap>
        </TopField>
        <BottomField onClick={handleStreamKeyShowType}>
          {streamKeyShow ? (
            <StreamKeyShowTypeText>HIDE</StreamKeyShowTypeText>
          ) : (
            <StreamKeyShowTypeText>SHOW</StreamKeyShowTypeText>
          )}
        </BottomField>
      </Content>
    </StyledStreamKeyField>
  );
};

export default StreamKeyField;
