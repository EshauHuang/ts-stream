import styled from "styled-components";
import { useState } from "react";

const ShowMoreButton = styled.div`
  display: inline-block;
  padding: 0.3rem 0;
  font-size: 1.3rem;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: color 0.2s ease-in-out;

  &:hover {
    color: rgba(255, 255, 255, 1);
  }
`;

const Info = styled.div`
  --max-lines: 2;

  font-size: 1.4rem;
  line-height: 2rem;
  font-weight: 500;
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: var(--max-lines);
  -webkit-box-orient: vertical;

  white-space: pre-wrap;

  span {
    font-size: 1.4rem;
  }

  a {
    color: rgba(62, 166, 255);
  }
`;

const InfoWrap = styled.div<{ showMore: boolean }>`
  margin: 1rem 0;
  padding: 1rem;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 1.2rem;
  transition: background-color 0.2s ease-in-out;

  ${({ showMore }) =>
    !showMore
      ? `
    cursor: pointer;

    &:hover {
    background-color: rgba(255, 255, 255, 0.1);

    ${ShowMoreButton} {
      color: rgba(255, 255, 255, 1);
    }
  }
  `
      : `
    ${Info} {
      --max-lines: initial;
      overflow: visible;
    }
  `}
`;

const ChannelInfo = ({ content }: { content: string }) => {
  const [showMore, setShowMore] = useState(false);
  const textArray = content.split("\n");

  return (
    <InfoWrap
      showMore={showMore}
      onClick={() => (!showMore ? setShowMore(true) : {})}
    >
      <Info>
        {textArray.map((text) => {
          const urlRegex = /(https?:\/\/[^\s]+)/g;
          const matchUrl = text.match(urlRegex);

          if (matchUrl) {
            return (
              <div>
                <span>
                  <a href={`${matchUrl[0]}`}>{matchUrl[0]}</a>
                </span>
              </div>
            );
          } else {
            return (
              <div>
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
