import React, { useEffect, useState, useContext } from "react";
import styled from "styled-components";

import Input from "@/components/input";

import { UserContext } from "@/contexts/userContext";

import { getUsers } from "@/json/users";
interface SignUpUser {
  name: string;
  username: string;
  password: string;
}

interface SignUpUserError {
  name: string;
  username: string;
  password: string;
}

const initialUser = {
  name: "",
  username: "",
  password: "",
};

const initialError = {
  name: "",
  username: "",
  password: "",
};

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Button = styled.button`
  margin: 10px;
`;

const SignUp = () => {
  const [user, setUser] = useState<SignUpUser>(initialUser);
  const [error, setError] = useState<SignUpUserError>(initialError);

  const { setCurrentUser } = useContext(UserContext);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const dataCheck = async (user: SignUpUser) => {
      let newError = Object.assign({}, initialError);

      let { data: users } = await getUsers()

      // 後端部分
      users.every(({ name, username }: {name: string, username: string}) => {
        if (name === user.name) {
          newError.name = "暱稱重複，請重新輸入";
        }
        
        if (username === user.username) {
          newError.username = "帳號重複，請重新輸入";
        }
        const noError = Object.values(newError).every((value) => value === "");
        if (noError) {
          users.push(user);
          setCurrentUser(user);
          setUser(initialUser);
        } else {
          setError(newError);
        }
      });
    };

    dataCheck(user);
  };

  const handleChangeValue: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { value, name } = e.target;

    setUser((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Container as="form" onSubmit={handleSubmit}>
      <Input
        label="姓名"
        type="text"
        name="name"
        value={user.name}
        error={error.name}
        onChange={handleChangeValue}
      />
      <Input
        label="帳號"
        type="text"
        name="username"
        value={user.username}
        error={error.username}
        onChange={handleChangeValue}
      />
      <Input
        label="密碼"
        type="password"
        name="password"
        value={user.password}
        error={error.password}
        onChange={handleChangeValue}
      />
      <Button type="submit">送出</Button>
    </Container>
  );
};

export default SignUp;
