import styled from "styled-components"

export const StyledVolumeButton = styled.div`
  display: flex;
  align-items: center;
`;


export const StyledVolumeBlock = styled.div`
  display: flex;
  align-items: center;
`;

export const VolumeSlider = styled.input<{ volume: number }>`
  width: 7rem;
  -webkit-appearance: none;
  height: 0.5rem;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 5px;
  background-image: linear-gradient(white, white);
  background-size: ${({ volume }) => `${volume * 100}% 100%`};
  background-repeat: no-repeat;
  cursor: pointer;
`;