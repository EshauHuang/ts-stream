import { useState } from "react";

import { InfoWrap, Info, ShowMoreButton } from "./channel.style";

const ChannelInfo = ({ content }: { content: string }) => {
  const [showMore, setShowMore] = useState(false);
  const textArray = content.split("\n");

  return (
    <InfoWrap
      showMore={showMore}
      onClick={() => (!showMore ? setShowMore(true) : {})}
    >
      <Info>
        {textArray.map((text, index) => {
          const urlRegex = /(https?:\/\/[^\s]+)/g;
          const matchUrl = text.match(urlRegex);

          if (matchUrl) {
            return (
              <div key={`${index}`}>
                <span>
                  <a href={`${matchUrl[0]}`}>{matchUrl[0]}</a>
                </span>
              </div>
            );
          } else {
            return (
              <div key={`${index}`}>
                <span>{text || "  "}</span>
              </div>
            );
          }
        })}
      </Info>
      <ShowMoreButton onClick={() => (showMore ? setShowMore(false) : {})}>
        {showMore ? "只顯示部分資訊" : "顯示完整資訊"}
      </ShowMoreButton>
    </InfoWrap>
  );
};

export default ChannelInfo;
