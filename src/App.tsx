import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import styled from "styled-components";

import SignInForm from "@/components/sign-in-form/sign-in-form.component";
import SignUpForm from "@/components/sign-up-form/sign-up-form.component";
import Live from "@/routes/live/live.component";

interface NavbarProps {
  bar: string;
  setBar: React.Dispatch<React.SetStateAction<string>>;
}

interface NavbarItemProps {
  currentTarget: number;
}

const Container = styled.div`
  margin-top: 60px;
  width: calc(100% - 1rem);
  margin-inline: auto;
  display: flex;
  gap: 20px;
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
    <Routes>
      <Route path="/">
        <Route path="sign-up" element={<SignUpForm />} />
        <Route path="sign-in" element={<SignInForm />} />
        <Route path="live" element={<Live />} />
      </Route>
    </Routes>
  );
};

export default App;
