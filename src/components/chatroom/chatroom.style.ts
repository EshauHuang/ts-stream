import styled from "styled-components";

export const Container = styled.div`
  width: 400px;
  min-width: 300px;
  max-height: 596px;
  border: 1px solid rgba(255,255,255,.2);
  display: flex;
  flex-direction: column;
  background-color: rgba(255,255,255,.05);
  border-radius: 1.2rem;

  @media (max-width: 1024px) {
    width: 100%;
  }
`;

export const ViewModeBar = styled.div`
  width: 100%;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(255,255,255,.2);
  font-size: 1.6rem;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
`;
