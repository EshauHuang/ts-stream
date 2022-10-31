import styled from "styled-components";

export const Container = styled.div`
  width: 400px;
  min-width: 300px;
  max-height: 596px;
  border: 1px solid #fff;
  display: flex;
  flex-direction: column;
  background-color: #333;

  @media (max-width: 1024px) {
    width: 100%;
  }
`;

export const ViewModeBar = styled.div`
  width: 100%;
  height: 5%;
  border-bottom: 1px solid #fff;
  font-size: 14px;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
`;
