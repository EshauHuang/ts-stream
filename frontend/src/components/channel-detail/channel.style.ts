import styled from "styled-components"

export const ShowMoreButton = styled.div`
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

export const Info = styled.div`
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

export const InfoWrap = styled.div<{ showMore: boolean }>`
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