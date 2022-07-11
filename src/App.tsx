import React, { useEffect, useState } from "react";
import styled from "styled-components";

import SignIn from "@/components/signIn";
import SignUp from "@/components/signUp";
import Chatroom from '@/components/chatroom'

interface NavbarProps {
  bar: string;
  setBar: React.Dispatch<React.SetStateAction<string>>;
}

interface NavbarItemProps {
  currentTarget: number;
}

const Container = styled.div`
  width: 60%;
  margin: 0 auto;
  background-color: #fff;
`;

const NavbarContainer = styled.ul`
  display: flex;
  border: 0 solid black;
  border-width: 0 0 1px 1px;
`;

const NavbarItem = styled.li<NavbarItemProps>`
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => (props.currentTarget ? "red" : "#ccc")};
  color: ${(props) => (props.currentTarget ? "#fff" : "black")};
  border: 0px solid black;
  border-width: 1px 1px 0 0;
`;

const Navbar: React.FC<NavbarProps> = ({ bar, setBar }) => {
  return (
    <NavbarContainer>
      <NavbarItem
        currentTarget={bar === "signIn" ? 1 : 0}
        onClick={() => setBar("signIn")}
      >
        登入
      </NavbarItem>
      <NavbarItem
        currentTarget={bar === "signUp" ? 1 : 0}
        onClick={() => setBar("signUp")}
      >
        註冊
      </NavbarItem>
    </NavbarContainer>
  );
};

const App = () => {
  const [bar, setBar] = useState("signIn");

  return (
    // <Container>
    //   <Navbar setBar={setBar} bar={bar} />
    //   {bar === "signIn" && <SignIn />}
    //   {bar === "signUp" && <SignUp />}
    // </Container>
    <Chatroom />
  );
};

export default App;
