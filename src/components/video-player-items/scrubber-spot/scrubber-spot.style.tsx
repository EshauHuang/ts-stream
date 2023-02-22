import styled from "styled-components";

export const Scrubber = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: red;
  transform: scale(0);
  transition: transform 0.2s ease-in-out;
`;

export const ScrubberContainer = styled.div`
  --scrubber-spot-size: 1.6;

  position: absolute;
  right: calc(
    100% - var(--progress-position) * 100% -
      calc(var(--scrubber-spot-size) * 1rem / 2 - 0.3rem)
  );

  top: 50%;
  width: var(--scrubber-spot-size) * 1rem;
  height: 1.6rem;
  aspect-ratio: 1/1;
  border: 0;
  background-color: transparent;
  transform: translateY(-50%);
`;