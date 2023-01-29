import styled from "styled-components";

export const Form = styled.form`
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #333;
  width: 90%;
  max-width: 500px;
  padding: 30px 10px;
  border-radius: 4px;
  box-shadow: 4px 4px 20px rgba(0, 0, 0, 0.4);
  color: white;

  a {
    color: #005fff;
  }

  @media (max-width: 480px) {
    width: 95%;
  }
`;

export const Content = styled.div``;

export const Title = styled.div`
  font-size: 3rem;
  margin-bottom: 3rem;
  font-weight: bold;
`;

export const Button = styled.button`
  background-color: rgba(255, 255, 255, 0.8);
  padding: 5px;
  border-radius: 4px;
  opacity: 1;
  cursor: pointer;
  font-size: 1.275rem;
  font-weight: bold;

  &:hover {
    background-color: rgba(255, 255, 255, 1);
  }
`;

export const Footer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  margin-top: 0.975rem;
  justify-content: flex-end;
`;