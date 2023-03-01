import styled from "styled-components";

export const Container = styled.div`
  width: 400px;
  min-width: 300px;
  max-height: 596px;
  border: 1px solid #fff;
  display: flex;
  flex-direction: column;
  background-color: rgba(255,255,255,.05);

  @media (max-width: 1024px) {
    width: 100%;
  }
`;

export const ViewModeBar = styled.div`
  width: 100%;
  height: 5%;
  border-bottom: 1px solid #fff;
  font-size: 1.4rem;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
`;
