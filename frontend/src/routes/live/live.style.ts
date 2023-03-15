import styled from "styled-components";

export const Container = styled.div`
  margin-top: 60px;
  width: calc(100% - 1rem);
  margin-inline: auto;
  display: flex;
  gap: 20px;
  
  @media (max-width: 1024px) {
    flex-direction: column;
  }
`;
