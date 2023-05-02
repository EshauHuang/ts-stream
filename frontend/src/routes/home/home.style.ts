import styled from "styled-components";

export const Container = styled.div`
  background-color: #0f0f0f;
`;

export const VideoList = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export const CategoriesList = styled.div`
  display: flex;
  width: 97%;
  margin: 0 auto;
  gap: 1rem;
  padding: 2rem 0;
`;

export const CategoryItem = styled.div<{ isTarget: boolean }>`
  padding: 1rem 1.5rem;
  background-color: ${({ isTarget }) =>
    isTarget ? "#fff" : "rgba(255, 255, 255, 0.1)"};
  color: ${({ isTarget }) => (isTarget ? "#000" : "#f1f1f1;")};
  border-radius: 0.8rem;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;

  &:hover {
    background-color: ${({ isTarget }) =>
    isTarget ? "#fff" : "rgba(255, 255, 255, 0.2)"};
  }
`;
