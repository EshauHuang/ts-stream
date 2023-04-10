import { Link } from "react-router-dom";
import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  background-color: #0393af;
`;

export const LinkList = styled.div`
  display: flex;
`;

export const StyledLink = styled(Link)`
  text-decoration: none;
  font-size: 1.5rem;
  padding: 1.8rem;
  color: #2b333fbf;
  font-weight: bold;
  transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
  cursor: pointer;

  &:hover {
    background-color: #2b333fbf;
    color: white;
    transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
  }
`;